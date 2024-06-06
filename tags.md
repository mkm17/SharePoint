---
layout: page
title: "Tags"
---

<h1>Tags</h1>
<ul>
  {% for tag in site.tags %}
    <li><a href="/tags/{{ tag[0] | slugify }}">{{ tag[0] }}</a></li>
  {% endfor %}
</ul>
