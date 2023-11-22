// const { eleventyImagePlugin } = require("@11ty/eleventy-img");
const Image = require("@11ty/eleventy-img");
const outdent = require('outdent');
const pluginRss = require("@11ty/eleventy-plugin-rss");

const imageShortcode = async (
  src,
  alt,
  className = undefined,
  widths = [700, 1152],
  formats = ['webp', 'jpeg'],
  sizes = '(max-width: 756px) 80vw, (min-width: 757px) 576px'
) => {
  const imageMetadata = await Image(src, {
    widths: [...widths],
    formats: [...formats],
    outputDir: '_site/img',
    filenameFormat: function (id, src, width, format, options) {
      // id: hash of the original image
      // src: original image path
      // width: current width in px
      // format: current file format
      // options: set of options passed to the Image call
      // console.log('SRC', getFileName(src));
      return `${getFileName(src)}-${id}-${width}.${format}`;
    }
  });

  // console.log('image', imageMetadata);

  // const imageAttributes = {
  //   alt,
  //   sizes,
  //   loading: "lazy",
  //   decoding: "async",
  // };

  // return Image.generateHTML(imageMetadata, imageAttributes);


  const sourceHtmlString = Object.values(imageMetadata)
    // Map each format to the source HTML markup
    .map((images) => {
      // The first entry is representative of all the others
      // since they each have the same shape
      const { sourceType } = images[0];

      // Use our util from earlier to make our lives easier
      const sourceAttributes = stringifyAttributes({
        type: sourceType,
        // srcset needs to be a comma-separated attribute
        srcset: images.map((image) => image.srcset).join(', '),
        sizes,
      });

      // Return one <source> per format
      return `<source ${sourceAttributes}>`;
    })
    .join('\n');

  const getLargestImage = (format) => {
    const images = imageMetadata[format];
    return images[images.length - 1];
  }

  const largestUnoptimizedImg = getLargestImage(formats[0]);
  const imgAttributes = stringifyAttributes({
    src: largestUnoptimizedImg.url,
    width: largestUnoptimizedImg.width,
    height: largestUnoptimizedImg.height,
    alt,
    loading: 'lazy',
    decoding: 'async',
  });
  const imgHtmlString = `<img ${imgAttributes}>`;

  const pictureAttributes = stringifyAttributes({
    class: className,
  });
  const picture = `<picture ${pictureAttributes}>
    ${sourceHtmlString}
    ${imgHtmlString}
  </picture>`;

  return outdent`${picture}`;
};

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("pages/assets/main.css");

  eleventyConfig.addPlugin(pluginRss, {
    posthtmlRenderOptions: {
      closingSingleTag: "default" // opt-out of <img/>-style XHTML single tags
    }
  });

  eleventyConfig.addShortcode("image", imageShortcode);

  return {
    dir: {
      input: "pages",
    }
  }
};

/** Maps a config of attribute-value pairs to an HTML string
 * representing those same attribute-value pairs.
 */
function stringifyAttributes(attributeMap) {
  return Object.entries(attributeMap)
    .map(([attribute, value]) => {
      if (typeof value === 'undefined') return '';
      return `${attribute}="${value}"`;
    })
    .join(' ');
};

function getFileName(path) {
  return path.split('/').pop().split('.')[0];
}