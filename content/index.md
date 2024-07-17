--- 
layout: pagelayout 
title: dchere posts 
templateEngineOverride: njk, md
---
<h1>Posts</h1>
<ul class="postlist">
{%- for post in collections.post | reverse -%}
    <li{% if page.url==post.url %} aria-current="page" {% endif %}>
        <a href="{{ post.url }}">{{ post.data.title }} <span class="postdate">
            [{{ post.data.date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day:
                'numeric'}) }}]</span></a>
    </li>
{%- endfor -%}
</ul>
