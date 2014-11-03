var httpRequest = null;
var content = null;
var tags = null;
var categories = null;
var blogs = null;

function makeRequest(url, content) 
{
    if (window.XMLHttpRequest) { // Mozilla, Safari, ...
      httpRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE
      try {
        httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
      } 
      catch (e) {
        try {
          httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
        } 
        catch (e) {}
      }
    }

    if (!httpRequest) {
      alert('Giving up :( Cannot create an XMLHTTP instance');
      return false;
    }
    httpRequest.onreadystatechange = function()
    {
      try {
        console.log(httpRequest.readyState)
        if (httpRequest.readyState === 4) {
          if (httpRequest.status === 200) {
            content=httpRequest.responseText;
            alert(content);
          } else {
            alert('There was a problem with the request.');
          }
        }
      }
      catch( e ) {
        alert('Caught Exception: ' + e.description);
      }
    }
    httpRequest.open('GET', url);
    httpRequest.send();
}



function init()
{
    initNagivator();
    initContents();
}

/* tags.json
 * {
 *  name:"tags",
 *  data:[
 *     {
 *      "name":"tags1",
 *      "count":"11"
 *     },
 *     {
 *      "name":"tags2",
 *      "count":"1"
 *      }
 *  ]
 *  }
 */  
function initNagivator()
{
    makeRequest('architecture/tags.json',content);
    alert(content);
    tags = JSON.parse(content);
    makeRequest('architecture/categories.json',content);
    categories = JSON.parse(content);
    
    renderTags();
    renderCategpries();   
}

function renderTags()
{
    var i;
    var element = document.getElementById("tags"); 
    for(i=0; i< tags.data.length; i++)
    {
        var tagconent  = tags.data[i];
        var newtag = document.createElement("div");
        newtag.setAttribute("class", "tag");
        var nt = newtag.createTextNode(tags.data[i].name + "("+ tags.data[i].count + ")");
        newtag.appendChild(nt);
    }
}

function renderCategpries()
{
    
}

function initContents()
{
    makeRequest('architecture/blogs.json');
    blogs = JSON.parse(content);
    renderBlogs();
}



