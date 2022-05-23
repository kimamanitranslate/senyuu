---
layout: default
---
<header>
  <h1><a href="{{ site.baseurl }}/">{{ page.title }}</a></h1>
  <small><a href="{{ site.baseurl }}/">Back to the main page</a></small></br>
  <a rel="noopener noreferrer" target="_blank" href="{{ page.rawURL }}">
    <img src="{{ page.banner }}" alt="{{ page.title }} banner">
  </a>
  {% include disclaimer.html %}
  {% if page.nextVolume or page.prevVolume %}
    <div class="center">
      <div class="volume-nav">
        {% if page.prevVolume %}
        <a class="prev-volume" href="{{ site.baseurl }}/chapters/{{ page.prevVolume }}/">Volume ➡</a>
        {% endif %}
        <a href="{{ site.baseurl }}/{{ page.indexURL | senyuu }}">Index</a>
        {% if page.nextVolume %}
        <a class="next-volume" href="{{ site.baseurl }}/chapters/{{ page.nextVolume }}/">Volume ➡</a>
        {% endif %}
      </div>
    </div>
  {% endif %}
</header>

<h2>List of Chapters</h2>
<ul id="index">
  {{ content }}
</ul>