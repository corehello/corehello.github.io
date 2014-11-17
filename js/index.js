var content;
var tags;
var blogs;

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
        var newtag = document.createElement("span")
        newtag.setAttribute("class", "tag");
        newtag.innerHTML =  tagcontent.name + "("+ tagcontent.count + ")" + " ";
        element.appendChild(newtag)
    }
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

function renderBlogs(blogs,options)
{
  if(blogs.data.length>= options.start)
  {
    console.log(blogs);
    var i;
    var element = document.getElementById("blogs");
    element.innerHTML="";
    console.log(options.start,options.end)
    for(i=options.start-1; i<(blogs.data.length>options.end?options.end:blogs.data.length); i++)
    {
      var blogcontent = blogs.data[i];
      var newblog = document.createElement("div");
      newblog.setAttribute("class", "blog");
      makeRequest('blogs/'+blogcontent.url, 'blog', newblog);
      var newtext = document.createTextNode(blogcontent.created_at);
      console.log(blogcontent.created_at);
      newblog.appendChild(newtext);
      element.appendChild(newblog);
    }
    var nextpage = document.createElement("div");
    nextpage.innerHTML = '<a onclick="nextpage()">Next page</a>';
    element.appendChild(nextpage);
  }
}


function insertContentToContainer(content, container)
{
  console.log(content);
  container.innerHTML = content + container.innerHTML; 
}


function makeRequest(url, type_data, container) 
{
    if (window.XMLHttpRequest) { // Mozilla, Safari, ...
      var httpRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE
      try {
       var httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
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
      console.log(httpRequest.readyState)
      if (httpRequest.readyState === 4) {
        if (httpRequest.status ===200 ) {
          console.log("type_data is " + type_data);
          switch(type_data)
          {
            case "tags":
              tags = JSON.parse(httpRequest.responseText); 
              renderTags(JSON.parse(httpRequest.responseText));
              break;
            case "blogs":
              blogs = JSON.parse(httpRequest.responseText);
              options = {start: 1, end: 5};
              renderBlogs(JSON.parse(httpRequest.responseText),options);
              window.page = 1;
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
    httpRequest.open('GET', url);
    httpRequest.send();
}

function nextpage()
{
  window.page = window.page + 1;
  console.log(window.page);
  options = {start: 5*(window.page-1)+1, end: 5*window.page};
  renderBlogs(blogs, options);
}

function init()
{

    initContents();
    initNagivator();
}


