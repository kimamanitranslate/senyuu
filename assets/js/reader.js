const searchParams = new URLSearchParams(window.location.search);
let linkToRawVolume, volumeNumber, chapters, linkToPreviousVolume, linkToNextVolume;
let chapterNumbers = [];
  
const makeMangaImage = (chapter, pageNumber) => {
  let savedPageNumber = searchParams.has('page') ? parseInt(searchParams.get('page')) - 1 : 0;
  if (savedPageNumber < 0 || savedPageNumber > (chapter.pages.length - 1)) {
    savedPageNumber = 0;
  }

  const div = document.createElement('div');
  div.setAttribute('data-page', pageNumber);
  div.classList.add('viewer');
  if (pageNumber === savedPageNumber || searchParams.get('scroll')) {
    div.classList.add('show');
  }

  const backBtn = document.createElement('button');
  backBtn.onclick = () => movePage(-1);

  const img = document.createElement('img');
  img.setAttribute('src', chapter.pages[pageNumber]);
  img.onload = () => setBackButtonSize(img, backBtn);

  const nextBtn = document.createElement('button');
  nextBtn.onclick = () => movePage(0);
  nextBtn.appendChild(img);

  if (searchParams.get('scroll')) {
    backBtn.setAttribute('disabled', true);
    nextBtn.setAttribute('disabled', true);
  }

  div.appendChild(backBtn);
  div.appendChild(nextBtn);
  return div;
};

const setBackButtonSize = (img, btn) => {
  btn.classList.add('loaded');
  btn.style.height = img.clientHeight + 'px';
  btn.style.width = (img.clientWidth / 3) + 'px';

  if (searchParams.has('full')) {
    img.style['max-height'] = window.innerHeight + 'px';

    const marginTop = ((window.innerHeight - img.clientHeight) / 2) + 'px';
    img.parentNode.style['margin-top'] = marginTop;
    img.parentNode.previousSibling.style['margin-top'] = marginTop;
  } else {
    img.style['max-height'] = null;
    img.parentNode.style['margin-top'] = null;
    img.parentNode.previousSibling.style['magrin-top'] = null;
  }
};

const toggleFullScreen = (forceShow = false) => {
  if (searchParams.get('full') && !forceShow) {
    reader.classList.remove('full-screen');
    searchParams.delete('full');
    const btn = reader.querySelector('.closer');
    btn && btn.remove();

    for (let img of document.querySelectorAll('#reader .viewer img')) {
      img.style['max-height'] = null;
      img.parentNode.style['margin-top'] = null;
      img.parentNode.previousSibling.style['margin-top'] = null;
    }
  } else {
    const viewers = document.querySelectorAll('#reader .viewer');
    if (viewers.length === 0) {
      return;
    }

    if (searchParams.get('scroll')) {
      toggleReader();
    }

    searchParams.set('full', true);
    reader.classList.add('full-screen');
    const btn = document.createElement('button');
    btn.innerText = '❌';
    btn.onclick = () => toggleFullScreen();
    btn.setAttribute('title', 'Close fullscreen');
    btn.classList.add('closer');
    reader.insertBefore(btn, reader.firstChild);
    setBackButtonSize(document.querySelector('#reader .viewer.show img'), document.querySelector('#reader .viewer.show button:first-of-type'));
  }

  history.pushState(null, null, window.location.origin + window.location.pathname + '?' + searchParams.toString());
};

const toggleReader = (forceShow = false) => {
  const viewers = document.querySelectorAll('#reader .viewer');
  if (viewers.length === 0) {
    return;
  }

  if (searchParams.get('scroll') && !forceShow) {
    searchParams.delete('scroll');
    for (let viewer of viewers) {
      viewer.classList.remove('show');
      for (let btn of viewer.querySelectorAll('button')) {
        btn.removeAttribute('disabled');
      }
    }

    let page = searchParams.get('page');
    if (!page || page > viewers.length || page < 0) {
      page = 0;
    } else {
      page--;
    }

    viewers[page].classList.add('show');

    document.querySelectorAll('.nav')[1].remove();

    for (let slct of document.querySelectorAll('select[name="pages"]')) {
      slct.style.display = 'block';
    }

    document.getElementById('switcher').innerText = '📜 Long Scroll';
    for (let btn of document.querySelectorAll('.prev-page')) {
      btn.style.display = 'block';
    }

    for (let btn of document.querySelectorAll('.next-page')) {
      btn.style.display = 'block';
    }
  } else {
    searchParams.set('scroll', true);
    for (let viewer of viewers) {
      viewer.classList.add('show');
      for (let btn of viewer.querySelectorAll('button')) {
        btn.setAttribute('disabled', true);
      }
    }

    const nav = document.querySelector('.nav');
    const reader = document.querySelector('#reader');
    reader.parentNode.insertBefore(nav.cloneNode(true), reader.nextSibling);

    for (let slct of document.querySelectorAll('select[name="pages"]')) {
      slct.style.display = 'none';
    }

    document.getElementById('switcher').innerText = '📄 Paged';
    for (let btn of document.querySelectorAll('.prev-page')) {
      btn.style.display = 'none';
    }

    for (let btn of document.querySelectorAll('.next-page')) {
      btn.style.display = 'none';
    }
  }

  history.pushState(null, null, window.location.origin + window.location.pathname + '?' + searchParams.toString());
};

const moveChapter = (nextChapterNumber = null, forcePage = null) => {
  const previousChapterNumber = searchParams.get('chapter') || chapterNumbers[0].toString();
  const previousChapterIndex = chapterNumbers.indexOf(previousChapterNumber);

  let index = chapterNumbers.indexOf(nextChapterNumber);
  let chapterNumber = chapterNumbers[index] && chapterNumbers[index].toString();
  if (index < 0) {
    index = 0;
    chapterNumber = chapterNumbers[index];
  }

  const chapter = chapters[chapterNumber];
  searchParams.set('chapter', chapterNumber.toString());

  if (previousChapterIndex <= index) {
    searchParams.set('page', 1);
  } else if (chapter && chapter.pages.length > 0) {
    searchParams.set('page', chapters[chapterNumber].pages.length);
  } else {
    searchParams.delete('page');
  }

  if (forcePage && chapter && forcePage <= chapter.pages.length && forcePage > 0) {
    searchParams.set('page', forcePage);
  }

  history.pushState(null, null, window.location.origin + window.location.pathname + '?' + searchParams.toString());

  if (chapter) {
    const select = document.querySelector('select[name="chapters"]');
    select.value = chapterNumber;

    const reader = document.getElementById('reader');
    const child = reader.querySelector('div');
    child && child.remove();
    const pageSelects = document.querySelectorAll('select[name="pages"]');

    if (chapter.pages.length > 0) {
      const div = document.createElement('div');
      reader.appendChild(div);
      for (let i = 0; i < chapter.pages.length; i++) {
        div.appendChild(makeMangaImage(chapter, i));
      }

      for (let slct of pageSelects) {
        slct.innerHTML = '';
        slct.value = searchParams.get('page') || 1;
        for (let i = 1; i <= chapter.pages.length; i++) {
          const option = document.createElement('option');
          option.value = i;
          option.innerText = 'Page ' + i;
          slct.appendChild(option);
        }
      }

      for (let btn of document.querySelectorAll('.switcher .switcher-child')) {
        btn.removeAttribute('disabled');
      }
    } else {
      const div = document.createElement('div');
      div.classList.add('alert');
      if (chapter.linkToDownload) {
        div.innerHTML = '<span>This chapter has not been uploaded here yet, but you can ' +
        ' <a href="' + (chapter.linkToDownload || linkToRawVolume) + '">download it</a>. ' +
        '<br><br><strong>Want to read this chapter in the reader? Consider helping out by uploading it!</strong> See steps to contribute <a href="https://docs.google.com/spreadsheets/d/1DM3nPPrHSJS-qGeLrQBgup-Y3k0DmtZBLYRMaYk0AVI/edit#gid=0">here</a>.</span>';
      } else {
        div.innerHTML = '<span>This chapter has unfortunately not been scanlated yet, or the download link has not been found. You can see the link to the raw chapter below!</span>';
      }

      reader.appendChild(div);

      for (let btn of document.querySelectorAll('.switcher .switcher-child')) {
        btn.setAttribute('disabled', true);
      }
    }

    document.getElementById('raw-chapter').setAttribute('href', chapter.linkToRawChapter || linkToRawVolume);
  }
};

const parseChapterTitle = (currChapNum, currChap) => {
  let chapterName = 'Ch. ' + currChapNum;
  if (currChapNum.includes('-')) {
    const [vol, chap] = currChapNum.split('-');
    chapterName = 'Vol. ' + vol + ' Ch. ' + chap;
  } else if (volumeNumber) {
    chapterName = 'Vol. ' + volumeNumber + ' ' + chapterName;
  }

  if (currChap.title) {
    chapterName += ' - ' + currChap.title;
  }

  return chapterName;
}

const shiftChapter = (number, forceStartAtPage1 = false) => {
  let index = chapterNumbers.indexOf(searchParams.get('chapter'));
  if (index < 0) {
    index = chapterNumbers.length - 1;
  }

  const nextChapterIndex = index + number;
  let queryParams = ''
  if (searchParams.has('full')) {
    queryParams = '?full=true';
  } else if (searchParams.has('scroll')) {
    queryParams = '?scroll=true'
  }

  if (nextChapterIndex < 0) {
    window.location = linkToPreviousVolume + queryParams;
    return;
  } else if (nextChapterIndex >= chapterNumbers.length) {
    window.location = linkToNextVolume + queryParams;
    return;
  }

  moveChapter(chapterNumbers[nextChapterIndex], forceStartAtPage1 ? 1 : null);
}

const movePage = (number) => {
  const page = document.querySelector('#reader .show');
  const viewers = document.querySelectorAll('#reader .viewer');
  let newPageNumber = -1;

  if (number >= 0) {
    const nextPage = number === 0
     ? page && page.nextElementSibling
     : viewers[number - 1];
    if (nextPage) {
      nextPage.classList.add('show');
      setBackButtonSize(nextPage.querySelector('img'), nextPage.querySelector('button:first-of-type'));
      newPageNumber = parseInt(nextPage.getAttribute('data-page')) + 1;
    } else {
      shiftChapter(1);
    }
  } else {
    const prevPage = page && page.previousElementSibling;
    if (prevPage) {
      prevPage.classList.add('show');
      setBackButtonSize(prevPage.querySelector('img'), prevPage.querySelector('button:first-of-type'));
      newPageNumber = parseInt(prevPage.getAttribute('data-page')) + 1;
    } else {
      shiftChapter(-1);
    }
  }

  if (newPageNumber >= 0) {
    searchParams.set('page', newPageNumber);
    for (let slct of document.querySelectorAll('select[name="pages"]')) {
      slct.value = newPageNumber;
    }

    history.pushState(null, null, window.location.origin + window.location.pathname + '?' + searchParams.toString());
  }

  
  page.classList.remove('show');
}

const initialize = (
  _linkToRawVolume,
  _chapters,
  _volumeNumber = null,
  _linkToPreviousVolume = '', 
  _linkToNextVolume = '',
) => {
  linkToRawVolume = _linkToRawVolume;
  volumeNumber = _volumeNumber;
  chapters = _chapters;
  linkToPreviousVolume = _linkToPreviousVolume;
  linkToNextVolume = _linkToNextVolume;
  chapterNumbers = Object.keys(chapters).sort((a, b) => a.localeCompare(b, 'en', {numeric: true}));

  window.onload = () => {
    window.onresize = (e) => {
      const img = document.querySelector('.viewer.show img');
      for (let btn of document.querySelectorAll('.viewer button:first-of-type')) {
        setBackButtonSize(img, btn);
      }
    };
  
    if (searchParams.get('scroll')) {
      searchParams.delete('full');
      searchParams.delete('page');
    }
  
    moveChapter(searchParams.get('chapter'), searchParams.get('page'));
  
    if (searchParams.get('scroll')) {
      toggleReader(true);
    }
  
    if (searchParams.get('full')) {
      toggleFullScreen(true);
    }
  };
};
