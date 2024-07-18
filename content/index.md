--- 
layout: pagelayout 
title: dchere posts 
templateEngineOverride: njk, md
---

<h2>For fun</h2>
<ul>
    <li><a href="/tic-tac-toe/">Different TicTacToe game</a></li>
</ul>

<h2>Recent posts</h2>
<ul class="postlist">
{%- for post in collections.post | reverse -%}
    <li{% if page.url==post.url %} aria-current="page" {% endif %}>
        <a href="{{ post.url }}">{{ post.data.title }} <span class="postdate">
            [{{ post.data.date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day:
                'numeric'}) }}]</span></a>
    </li>
{%- endfor -%}
</ul>
