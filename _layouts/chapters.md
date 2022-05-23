---
layout: default
---
<header>
  <h1><a href="{{ site.baseurl }}/">{{ page.title }}</a></h1>
  <small><a href="{{ site.baseurl }}/">Back to the main page</a></small></br>
  <a rel="noopener noreferrer" target="_blank" href="{{ page.rawURL }}">
    {% if page.tallBanner %}
      <img style="max-width: unset; max-height: 400px; width: auto;" src="{{ page.banner }}" alt="{{ page.title }} banner">
    {% else %}
      <img src="{{ page.banner }}" alt="{{ page.title }} banner">
    {% endif %}
  </a>
  {% include disclaimer.html %}
  {% include volume-nav.html pageType="chapters" %}
</header>

{{ content }}

<main>
  <h2>List of Chapters</h2>
  <ul id="index">
    {% for chapter in site.data[page.volumeName] %}
      <li>
        <a href="{{ site.baseurl }}/reader/{{ page.volumeName }}?chapter={{ chapter[0] }}">{% include chapter-name.html chapter=chapter %}</a>
        <div class="filler"></div>
        <span class="right">
          <a rel="noopener noreferrer" target="_blank" href="{{ chapter[1].linkToRawChapter }}">Raw</a>
          <a href="{{ chapter[1].linkToDownload }}">Download</a>
        </span>
      </li>
    {% endfor %}
  </ul>
</main>