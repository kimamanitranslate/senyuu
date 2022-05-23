---
layout: default
---
<header>
  <div class="title">
    <h1><a href="{{ site.baseurl }}/chapters/{{ page.volumeName }}">{{ page.title }}</a></h1>
    <div class="switcher">
      <a id="switcher" class="switcher-child" href="#" onclick="toggleReader()">📜 Long Scroll</a>
      <button class="switcher-child" onclick="toggleFullScreen()">📺 Full Screen</button>
    </div>
  </div>
</header>

<main>
  <div class="select-wrapper">
    <select onchange="moveChapter(this.value, 1)" name="chapters">
    {% for chapter in site.data[page.volumeName] %}
      <option value="{{ chapter[0] }}">{% include chapter-name.html chapter=chapter %}</option>
    {% endfor %}
    </select>
  </div>

  <div class="nav">
    <div class="nav-group">
      <button class="prev-page" type="button" onclick="movePage(-1)">⬅ Prev Page</button>
      <a class="prev-chapter" href="#" onclick="shiftChapter(-1, true)">⬅ Prev Ch.</a>
    </div>
    <select onchange="movePage(this.value)" name="pages"></select>
    <div class="nav-group">
      <button class="next-page" type="button" onclick="movePage(0)">Next Page ➡</button>
      <a class="next-chapter" href="#" onclick="shiftChapter(1)">Next Ch. ➡</a>
    </div>
  </div>

  <section id="reader"></section>

  {% include volume-nav.html pageType="reader" %}
  {% include disclaimer.html %}

  <div class="alert">
    <img src="https://64.media.tumblr.com/0a9519245dd03d42ae14b97d05e26424/9ec9d5b604b38343-36/s250x400/c8785497caf0c0ef450f5404bf2b0455a218dc57.png">
    <p>
      If you enjoyed this chapter, please consider supporting Haruhara by purchasing the raw chapter <strong><a rel="noopener noreferrer" target="_blank" id="raw-chapter" href="">here!</a></strong>
    </p>
  </div>

  <div class="alert">
    <img src="https://64.media.tumblr.com/71f6f03abefb51f78420d35f74c76c65/9ec9d5b604b38343-e7/s540x810/e9902cf82aa39ee659a01431a210843617398c43.png">
    <p>
      Please don't post screenshots of these scanlations on Twitter! It may bring it to the attention of Haruhara and Japanese fans, forcing these scanlations to stop.
    </p>
  </div>
</main>
