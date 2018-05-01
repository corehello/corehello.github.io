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
    function tagscallback(data)
    {
              tags = JSON.parse(data);
              renderTags(tags);
    }
    makeRequest('architecture/tags.json', tagscallback);
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
    function blogscallback(data)
    {
              blogs = JSON.parse(data);
              blogcontents = blogs;
              options = {start: 1, end: 5};
              window.page = 1;
              renderBlogs(blogcontents, options);

    };
    makeRequest('architecture/blogs.json', blogscallback);
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
      newblog.blogid=i;
      newblog.setAttribute("class", "blog")
      newblog.innerHTML = '<a onclick=pop_blog(' + "\"" + blogcontent["url"].toString() + "\"" + ')>' + blogcontent["url"].split(".")[0].split("_").join(" ") + "</a>";
      element.appendChild(newblog);
    }

    if(window.page == 1)
    {
      document.getElementById("prepage").setAttribute("style", "display: none")
    }
    
    document.getElementById("pagenumber").innerText = window.page+" / "+ Math.ceil(blogs.data.length/5)
    
    if(window.page == Math.ceil(blogs.data.leggth/5))
    {
      document.getElementById("nextpage").setAttribute("style", "display: none")
    }
  }
}

function pop_blog(params)
{
  var newblog = document.getElementById("blog");
  newblog.innerHTML = "";
  newblog.setAttribute("class", "blog");
  console.log("loading...");
  makeRequest('blogs/'+ params, insertContentToContainer(newblog));
  document.getElementById("blogcontext").style.display = "block";
}

function closeblog()
{
  document.getElementById('blogcontext').style.display='none'
}

function insertContentToContainer(container,content)
{
  return function (c){
      container.innerHTML = c + container.innerHTML;
  }
}


function makeRequest(url, callback)
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
          data = httpRequest.responseText;
          callback(data);

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
