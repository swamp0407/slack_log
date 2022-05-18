import React from "react";

const SlackFilesLink = ({ file_links }) => {
  const create_link = (files) => {
    let ret = "";
    for (let i = 0; i < files.length; ++i) {
      ret += create_atag(files[i].url, files[i].title, files[i].mimetype);
    }
    return ret;
  };
  const create_atag = (url, filename, mimetype) => {
    let ret = `<div style="padding: 10px; margin-bottom: 10px; border: 5px double #333333;">
                  <a href=${encodeURI(url)} target="_blank">${filename}</a>
                   </div>`;
    try {
      // let file_ext = filename.split('.').pop();
      const conds = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "application/pdf",
      ];
      const imageconds = [
        "image/tiff",
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/bmp",
        "image/png",
      ];
      if (imageconds.includes(mimetype)) {
        // ret = ret + `<iframe src="https://docs.google.com/viewer?url=${encodeURI(url)}&amp;embedded=true" width="30%" height="130" style="border: none;"></iframe>`
        ret += `<img src=${encodeURI(
          url
        )} class="img-item" alt=${filename} width="30%" height="130">\n`;
      } else if (conds.includes(mimetype)) {
        ret += `<iframe src="https://docs.google.com/viewer?url=${encodeURI(
          url
        )}&amp;embedded=true" width="40%" height="200" style="border: none;"></iframe>`;
      }
    } catch (e) {
      console.log(e);
    }
    return ret;
  };
  const clickHandler = (event) => {
    if (event.target.className == "img-item") {
      var grayDisplay = document.getElementById("gray-display");
      var largeImg = document.getElementById("large-img");
      const targetImg = event.target.currentSrc;
      grayDisplay.style = "display:block;";
      largeImg.style = "display:block;";
      largeImg.classList.remove("fadeout");
      var img_element = document.createElement("img");
      img_element.src = targetImg;
      largeImg.appendChild(img_element);

      grayDisplay.addEventListener("click", function () {
        largeImg.classList.add("fadeout");
        setTimeout(function () {
          grayDisplay.style = "display:none;";
          largeImg.style = "display:none;";
          largeImg.innerHTML = "";
        }, 200);
      });
    }
  };
  return (
    <div
      onClick={clickHandler}
      className="slack-files-link"
      dangerouslySetInnerHTML={{
        __html: create_link(file_links),
      }}
    />
  );
};

export default SlackFilesLink;
