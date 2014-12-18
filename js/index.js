var content;
var tags;
var blogs;
var blogcontents;

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
 *        "keywords": [
 *          "first"
 *        ]
 *      }
 *
 *    ]
 *  }
 */

function renderBlogs(blogs,options)
{
  if(blogs.data.length>= options.start)
  {
    var i;
    var element = document.getElementById("blogs");
    element.innerHTML="";
    console.log(options.start,options.end);
    for(i=blogs.data.length-options.start; i>=(blogs.data.length-options.end<0?0:blogs.data.length-options.end); i--)
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
    if(window.page != 1)
    {
      var prepage = document.createElement("span");
      prepage.setAttribute("class", "left");
      prepage.innerHTML = '<a onclick="nextpage(0)"><--Prepage</a>';
      element.appendChild(prepage);
    }
    var pagenum = document.createElement("span")
    pagenum.innerText = window.page+"/"+((blogs.data.length-blogs.data.length%5)/5 +1 )
    element.appendChild(pagenum)
    if(window.page != (blogs.data.length-blogs.data.length%5 + 5)/5)
    {
      var nextpage = document.createElement("span");
      nextpage.setAttribute("class", "right")
      nextpage.innerHTML = '<a onclick="nextpage(1)">Nextpage--></a>';
      element.appendChild(nextpage);
    }
  }
}


function insertContentToContainer(content, container)
{
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
              blogcontents = blogs;
              options = {start: 1, end: 5};
              window.page = 1;
              renderBlogs(blogcontents, options);
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

function nextpage(w)
{
  window.page = window.page + (2*w-1);
  console.log(window.page);
  options = {start: 5*(window.page-1)+1, end: 5*window.page};
  console.log(options);
  renderBlogs(blogcontents, options);
}

function search()
{

}

function init()
{

    initContents();
    initNagivator();
}


