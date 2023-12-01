fetch("./html/filter_story_points.html")
  .then(response => {
    return response.text()
  })
  .then(data => {
    document.querySelector(".chart").innerHTML = data;
  });
