var httpRequest = null;
var content = null;
var tags = null;
var categories = null;
var blogs = null;


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
    makeRequest('architecture/tags.json',"tags", content);
}


function renderTags(tags)
{
    console.log(tags);
    var i;
    var element = document.getElementById("tags"); 
    for(i=0; i< tags.data.length; i++)
    {
        var tagcontent  = tags.data[i];
        var newtag = document.createElement("div");
        newtag.setAttribute("class", "tag");
        var nt = newtag.createTextNode(tagcontent.name + "("+ tagcontent.count + ")");
        newtag.appendChild(nt);
        element.appendChild(newtag);
    }
}


function renderCates(cates)
{
    
}

function initContents()
{
  makeRequest('architecture/blogs.json', 'blogs', content);
}

/*
 *  {
 *    "name" : "blogs",
 *    "data" : [
 *      {
 *        "url" : "",
 *        "created_at" : "",
 *        "tags" : [
 *          "tags1",
 *          "tags2"
 *          ]
 *      }
 *
 *    ]
 *  }
 */

function renderBlogs(blogs)
{
  console.log(blogs);
  var i;
  var element = document.getElementById("blogs")
  for(i=0; i<blogs.data.length; i++)
  {
    var blogcontent = blogs.data[i];
    var newblog = document.createElement("div");
    newblog.setAttribute("class", "blog");
    var nb = newblog.createElement("div");
    //makeRequest('blogs/'+blogcontent.url, 'blog', nb);
    newblog.appendChild(nb);
    element.appendChild(newblog);
  }
}


function insertContentToContainer(content, container)
{
  container.innerHTML = content; 
}


function makeRequest(url, type_data, container) 
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
          if (httpRequest.status >=200 && httpRequest.status < 300 || httpRequest.status == 304 ) {
            console.log("type_data is " + type_data);
            switch(type_data)
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
              case "blog":
                insertContentToContainer(httpRequest.responseText, container);
                break;
              default:
                console.log("not supported this funciton");
            }
          } else {
            console.log('There was a problem with the request.');
          }
        }
      }
      catch( e ) {
        console.log('Caught Exception: ' + e.message);
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


