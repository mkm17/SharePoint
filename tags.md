---
layout: page
title: "Tags"
---


<ul>
  {% for tag in site.tags %}
    <li><a href="/tags/{{ tag[0] | slugify }}">{{ tag[0] }}</a></li>
  {% endfor %}
</ul>
