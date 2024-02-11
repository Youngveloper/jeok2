document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("slider");
  const video = document.getElementById("swing-video");
  const videoSource = document.getElementById("video-source");
  const muteButton = document.getElementById("mute-button");
  const trafficLights = document.getElementsByClassName("traffic-lights");
  const fallingImageContainer = document.querySelector(".falling-image");
  const containerSize = document
    .querySelector(".tv-container")
    .getBoundingClientRect();

  const imagePaths = [
    "img/chocolates/chocolate1.png",
    "img/chocolates/chocolate2.png",
    "img/chocolates/chocolate3.png",
    "img/chocolates/chocolate4.png",
    "img/chocolates/chocolate5.png",
    "img/chocolates/chocolate6.png",
    "img/chocolates/chocolate7.png",
    "img/chocolates/chocolate8.png",
    "img/candies/blue_candy.png",
    "img/candies/purple_candy.png",
    "img/candies/red_candy.png",
  ];

  const nametagImagePaths = [
    "img/nametags/nametag_get.png",
    "img/nametags/nametag_get_blank.png",
    "img/nametags/nametag_left_blank.png",
    "img/nametags/nametag_right_blank.png",
    "img/nametags/nametag_out.png",
    "img/nametags/nametag_of.png",
    "img/nametags/nametag_the.png",
    "img/nametags/nametag_box.png",
  ];

  const audioElement = new Audio("sound/success1.mp3");

  let resetTimeout;
  let lastImageCreationTime = 0;

  // slider & images animation
  slider.addEventListener("input", function () {
    updateVideoSource();
    updateTrafficLight();

    if (slider.value === "1") {
      document.body.style.cursor = "crosshair";
    } else if (slider.value === "3") {
      document.body.style.cursor = "move";
    } else {
      document.body.style.cursor = "auto";
    }
  });

  function updateVideoSource() {
    const videoSources = {
      1: "img/videos/swing_2real.mp4",
      2: "img/videos/tv_jeok_real.mp4",
      3: "img/videos/glitch4.mp4",
    };

    const newSource = videoSources[slider.value];

    video.pause();

    videoSource.src = newSource;
    video.load();

    video.addEventListener("loadedmetadata", () => {
      video.addEventListener("pause", () => {
        video.play();
      });
      if (video.paused) {
        video.play();
      }
    });
  }

  // slider gradients
  slider.style.setProperty("--min", slider.min);
  slider.style.setProperty("--max", slider.max);
  slider.style.setProperty("--value", slider.value);

  slider.addEventListener("input", function () {
    slider.style.setProperty("--value", slider.value);
    resetSliderTimeout();
  });

  function resetSliderTimeout() {
    clearTimeout(resetTimeout);

    resetTimeout = setTimeout(() => {
      slider.value = "2";
      slider.style.setProperty("--value", "2");
      document.body.style.cursor = "auto";
      updateVideoSource();
    }, 30000);
  }

  // nametags falling
  const nametagsContainer = [];

  function getRandomNametagPath() {
    const nametagIndex = Math.floor(Math.random() * nametagImagePaths.length);
    return nametagImagePaths[nametagIndex];
  }

  function getRandomNametagSize(tagPath) {
    const tag = new Image();
    tag.src = tagPath;

    const aspectRatio = tag.width / tag.height;

    const maxWidth = 250;
    const minWidth = 100;
    const maxHeight = 150;

    let width =
      Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
    let height = width / aspectRatio;

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    return { width, height };
  }

  // p5.js sketch
  const sketch = new p5((p) => {
    p.setup = () => {
      p.createCanvas(containerSize.width, containerSize.height);
    };

    p.draw = () => {
      if (slider.value !== "1" && slider.value !== "3") {
        while (fallingImageContainer.firstChild) {
          fallingImageContainer.removeChild(fallingImageContainer.firstChild);
        }
      }
    };

    // mouse pressed chococandies
    p.mousePressed = () => {
      if (p.mouseIsPressed && slider.value === "1") {
        const mouseX = p.mouseX - containerSize.left;
        const mouseY = p.mouseY - containerSize.top;

        if (
          mouseX >= 0 &&
          mouseX <= containerSize.width &&
          mouseY >= 0 &&
          mouseY <= containerSize.height
        ) {
          document.body.style.cursor = "crosshair";

          // play audio
          audioElement.play();

          // creating new images
          const newImage = document.createElement("img");
          const randomImagePath = getRandomImagePath();

          newImage.src = randomImagePath;
          newImage.alt = "New Image";

          newImage.style.position = "absolute";

          const randomSize = getRandomSize(randomImagePath);
          const newImageWidth = randomSize.width;
          const newImageHeight = randomSize.height;

          newImage.style.top = mouseY - 50 + "px";
          newImage.style.left = mouseX - 50 + "px";

          newImage.style.width = newImageWidth + "px";
          newImage.style.height = newImageHeight + "px";

          newImage.style.opacity = "0";

          fallingImageContainer.appendChild(newImage);

          // gradually increase opacity
          setTimeout(() => {
            newImage.style.transition = "opacity 0.3s ease-in-out";
            newImage.style.opacity = "1";
          }, 30);

          setTimeout(() => {
            newImage.style.transition = "opacity 2s ease-in-out";
            newImage.style.opacity = "0";
          }, 3000);
        }
      }
      resetSliderTimeout();
    };

    function getRandomImagePath() {
      const randomIndex = Math.floor(Math.random() * imagePaths.length);
      return imagePaths[randomIndex];
    }

    function getRandomSize(imagePath) {
      const image = new Image();
      image.src = imagePath;

      const aspectRatio = image.width / image.height;

      const maxWidth = 200;
      const minWidth = 50;
      const maxHeight = 200;

      let width =
        Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
      let height = width / aspectRatio;

      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }

      return { width, height };
    }

    // mouse moved nametags
    p.mouseMoved = () => {
      if (slider.value === "3") {
        const currentTime = new Date().getTime();

        if (currentTime - lastImageCreationTime > 300) {
          const mouseX = p.mouseX - containerSize.left;
          const mouseY = p.mouseY - containerSize.top;

          if (
            mouseX >= 0 &&
            mouseX < containerSize.width &&
            mouseY >= 0 &&
            mouseY <= containerSize.height
          ) {
            document.body.style.cursor = "move";

            const newTag = document.createElement("img");
            const randomTagPath = getRandomNametagPath();

            newTag.src = randomTagPath;
            newTag.alt = "New tag";

            newTag.style.position = "absolute";
            newTag.classList.add("shake");

            const randomTagSize = getRandomNametagSize(randomTagPath);
            const newTagWidth = randomTagSize.width;
            const newTagHeight = randomTagSize.height;

            newTag.style.top = mouseY - 50 + "px";
            newTag.style.left = mouseX - 50 + "px";

            newTag.style.width = newTagWidth + "px";
            newTag.style.height = newTagHeight + "px";

            newTag.style.opacity = "0";

            fallingImageContainer.appendChild(newTag);

            setTimeout(() => {
              newTag.style.transition = "opacity 0.3s ease-in-out";
              newTag.style.opacity = "1";
            }, 30);

            setTimeout(() => {
              newTag.style.transition = "opacity 2s ease-in-out";
              newTag.style.opacity = "0";
            }, 3000);

            lastImageCreationTime = currentTime;
          }
        }
        resetSliderTimeout();
      }
    };
  });

  // mute
  muteButton.addEventListener("click", toggleMute);

  function toggleMute() {
    if (video.muted) {
      video.muted = false;
      muteButton.style.backgroundImage = 'url("img/icons/mute.png")';
    } else {
      video.muted = true;
      muteButton.style.backgroundImage = 'url("img/icons/unmute.png")';
    }
  }

  // traffic lights
  function updateTrafficLight() {
    const lightColors = {
      1: { green: "#00FF1E", yellow: "#966600", red: "#910707" },
      2: { green: "#023008", yellow: "#ffd000", red: "#910707" },
      3: { green: "#023008", yellow: "#966600", red: "#ff0000" },
    };

    for (let i = 0; i < trafficLights.length; i++) {
      const light = trafficLights[i];
      const circle = light.querySelector("ellipse");
      const lightColor = circle.getAttribute("id");
      circle.style.fill = lightColors[slider.value][lightColor];
    }
  }
});
