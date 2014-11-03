var httpRequest = null;
var tags = null;
var categories = null;
var blogs = null;

function makeRequest(url, action) 
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
    httpRequest.onreadystatechange = function(action)
    {
      try {
        console.log(httpRequest.readyState)
        if (httpRequest.readyState === 4) {
          if (httpRequest.status === 200) {
            alert(action)
            switch(action)
            {
              case "tags":
                renderTags(JSON.parse(httpRequest.responseText));
                break;
              case "cates":
                renderCates(JSON.parse(httpRequest.responseText));
                break;
              case "blogs":
                renderBlogs(JSON.parse(httpRequest.responseText));
                break;
              default:
                alert("not supported this funciton");
            }
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
    makeRequest('architecture/tags.json',"tags");
}


function renderTags(tags)
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

function renderCates(cates)
{
    
}

function initContents(blogs)
{
    makeRequest('architecture/blogs.json', 'blogs');
}



