// Check for logged in users
checkLoginStatus();

$(document).ready(function() {

    $('#community-wrapper').load("community/forum.html");
});

function loadDesignatedPage(communityPage) {
    if (communityPage == 'news') {
        $('#community-wrapper').load("community/news.html");
    } else if (communityPage === 'forum') {
        $('#community-wrapper').load("community/forum.html");
    }
}