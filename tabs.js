// TABS
// ==================================================================================
function openTabs(evt, ContentTabs) {
    var i, tabcontent, buttontabs;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    buttontabs = document.getElementsByClassName("buttontabs");
    for (i = 0; i < buttontabs.length; i++) {
        buttontabs[i].className = buttontabs[i].className.replace(" active", "");
    }

    document.getElementById(ContentTabs).style.display = "block";
    evt.currentTarget.className += " active";
}

document.getElementById("default").click();