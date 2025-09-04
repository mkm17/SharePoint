---
layout: pageES
title: "Etiquetas"
permalink: /es/tags/
---

<ul>
  {% for tag in site.tags %}
    {% assign tag_name = tag[0] %}
    {% assign tag_slug = tag_name | slugify %}
    
    {% comment %} Create Spanish URLs for common tags {% endcomment %}
    {% case tag_name %}
      {% when "SharePoint" %}
        <li><a href="/es/tags/sharepoint/">{{ tag_name }}</a></li>
      {% when "SPFx" %}
        <li><a href="/es/tags/spfx/">{{ tag_name }}</a></li>
      {% when "Power Automate" %}
        <li><a href="/es/tags/power-automate/">{{ tag_name }}</a></li>
      {% when "Chrome Extension" %}
        <li><a href="/es/tags/chrome-extension/">{{ tag_name }}</a></li>
      {% when "SharePointApi" %}
        <li><a href="/es/tags/sharepointapi/">{{ tag_name }}</a></li>
      {% else %}
        <li><a href="/tags/{{ tag_slug }}">{{ tag_name }}</a></li>
    {% endcase %}
  {% endfor %}
</ul>
