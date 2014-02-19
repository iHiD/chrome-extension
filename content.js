$(document).ready(function() {
    $('button:contains("Share")').click(function() {
        setTimeout(function() {
            var shareList = $('.shareContent ul')
            var item = $('.shareContent ul li:last-child').clone()
            shareList.append(item)
            $(item).find('a').css('background', 'url(https://d20aydchnypyzp.cloudfront.net/assets/logo-e17d8f35f58d56ac210fc3c60a0fbfe5.png) no-repeat 50% 50%')
            $(item).find('a').attr('href','#')
            $(item).click(function() {
                var link = $('.shareContent input').val()
                window.open( "http://localhost:3000/hi.html#" + encodeURIComponent(link), "shareOnMeducation", "status = 1, height = 500, width = 360, resizable = 0" )
                return false;
            })
        }, 1000)
        return true;   
    })
})

function myPopup(url) {
        
}