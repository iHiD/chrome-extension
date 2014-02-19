$(document).ready(function() {
  chrome.tabs.getSelected(null, function(tab) {
    $('input#url').val(tab.url)
    $('iframe#med_frame').attr('src', 'https://www.meducation.net#url=' + encodeURIComponent(tab.url))
  })  
  $boardList = $('#boardList')
  manager = new Meducation.BoardItemManager("MediaFile", null, false)
  $boardList.html(manager.$elem)
  $boardList.show()
})

