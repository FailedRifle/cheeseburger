//---------------------------------//
//---------------------------------//
//---------------------------------//
// WELCOME ANIMATION SCRIPT //
//---------------------------------//
//---------------------------------//
//---------------------------------//

gsap.fromTo(
  ".h1one",
  {
    x: -150,
    opacity: 0,
  },
  {
    x: 0,
    opacity: 1,
    duration: 1.5,
    ease: "expo.inOut",
  }
);
gsap.fromTo(
  ".h1two",
  {
    y: -200,
    opacity: 0,
  },
  {
    delay: 0.5,
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "expo.inOut",
  }
);
gsap.fromTo(
  ".h1three",
  {
    y: 200,
    opacity: 0,
  },
  {
    delay: 0.5,
    y: 0,
    opacity: 1,
    duration: 1.5,
    ease: "expo.inOut",
  }
);
gsap.fromTo(
  ".h1four",
  {
    x: 140,
    opacity: 0,
  },
  {
    delay: 0.5,
    x: 0,
    opacity: 1,
    duration: 1.5,
    ease: "expo.inOut",
  }
);
gsap.fromTo(
  ".h1five",
  {
    y: -100,
    opacity: 0,
  },
  {
    delay: 0.2,
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "expo.inOut",
  }
);
gsap.fromTo(
  ".h1six",
  {
    x: 100,
    opacity: 0,
  },
  {
    delay: 0.7,
    x: 0,
    opacity: 1,
    duration: 1.5,
    ease: "expo.inOut",
  }
);
gsap.fromTo(
  ".h1seven",
  {
    opacity: 0,
  },
  {
    delay: 1.8,
    opacity: 1,
    duration: 1,
  }
);
gsap.fromTo(
  ".h1eight",
  {
    opacity: 0,
  },
  {
    delay: 2,
    opacity: 1,
    duration: 0.5,
    onComplete: function () {
      const body = document.getElementById("body");
      body.addEventListener("click", sweepUp, { once: true });
      gsap.fromTo(
        ".cta",
        {
          y: 20,
        },
        {
          opacity: 1,
          duration: 0.5,
          y: 0,
          ease: "power1.out",
        }
      );
    },
  }
);
function sweepUp() {
  const message = document.getElementById("welcomeMsgDiv");
  gsap.to(".h1one", {
    y: "-300",
    duration: 2,
    ease: "expo.inOut",
    opacity: 0,
    onComplete: function () {
      message.style.animation = "unblurdiv 0.6s ease forwards";
      message.addEventListener("animationend", () => {
        message.style.display = "none";
        const name = document.getElementById("enterName");
        name.style.display = "flex";
        startOnboarding();
      });
    },
  });
  gsap.to(".h1two", {
    y: "-600",
    delay: 0.5,
    duration: 1.3,
    ease: "expo.inOut",
    opacity: 0,
  });
  gsap.to(".h1three", {
    y: "-100",
    duration: 1.3,
    delay: 0.2,
    ease: "expo.inOut",
    opacity: 0,
  });
  gsap.to(".h1four", {
    y: "-800",
    delay: 0.7,
    duration: 1.3,
    ease: "expo.inOut",
    opacity: 0,
  });
  gsap.to(".h1five", {
    delay: 0.8,

    y: "-400",
    duration: 1.3,
    ease: "expo.inOut",
    opacity: 0,
  });
  gsap.to(".h1six", {
    delay: 0.3,
    y: "-200",
    duration: 1.3,
    ease: "expo.inOut",
    opacity: 0,
  });
  gsap.to(".h1seven", {
    delay: 0.7,
    y: "-500",
    duration: 1.3,
    ease: "expo.inOut",
    opacity: 0,
  });
  gsap.to(".h1eight", {
    y: "-300",
    duration: 1.3,
    ease: "expo.inOut",
    opacity: 0,
  });
  gsap.to(".cta", {
    opacity: 0,
    delay: 1,
  });
}

//---------------------------------//
//---------------------------------//
//---------------------------------//
// ONBOARDING ANIMATION SCRIPT //
//---------------------------------//
//---------------------------------//
//---------------------------------//
function startOnboarding() {
  gsap.fromTo(
    ".stagger1",
    {
      y: 20,
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power1.out",
      stagger: 0.1,
    }
  );
}
function ghost1() {
  gsap.to(".stagger1", {
    y: -20,
    opacity: 0,
    duration: 0.4,
    onComplete: function () {
      const message = document.getElementById("enterName");
      message.style.display = "none";
      part2();
    },
  });
}
let inputName = document.getElementById("inputName");
inputName.addEventListener("keyup", function () {
  if (event.key === "Enter") {
    let UserName = inputName.value;
    console.log("User Name Entered: " + UserName);
    localStorage.setItem("name", UserName);
    ghost1();
  }
});
let UserName = localStorage.getItem("name");

function part2() {
  const name = document.getElementById("chooseBg");
  name.style.display = "flex";

  gsap.fromTo(
    ".stagger2",
    {
      opacity: 0,
      y: 50,
    },
    {
      delay: 0.4,
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power1.out",
      stagger: 0.1,
      onComplete: function () {
        let img = document.querySelectorAll(".bgselect");

        img.forEach((el) => {
          el.addEventListener("mouseenter", () => {
            img.forEach((e) => (e.style.opacity = "40%"));
          });

          el.addEventListener("mouseleave", () => {
            img.forEach((e) => (e.style.opacity = "100%"));
          });
        });
      },
    }
  );
}
function finish() {
  const finish = document.getElementById("finish");
  finish.style.display = "flex";
  gsap.fromTo(
    ".stagger3",
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 0.5,
      ease: "power1.out",
    }
  );
}
function ghost2() {
  gsap.fromTo(
    ".stagger2",
    {
      opacity: 1,
      y: 0,
    },
    {
      y: -50,
      opacity: 0,
      duration: 0.4,
      ease: "power1.out",
      stagger: 0.1,
      onComplete: function () {
        const message = document.getElementById("chooseBg");
        message.style.display = "none";
        finish();
      },
    }
  );
}
let backgroundURL = localStorage.getItem("backgroundURL");

function setDefaultBackground(url) {
  localStorage.setItem("backgroundURL", url);
  backgroundURL = localStorage.getItem("backgroundURL");
  document.documentElement.style.setProperty(
    "--backgroundURL",
    `url(${url})`
  );
}
if (backgroundURL == null) {
  localStorage.setItem("backgroundURL", "/assets/img/bg3.png");
}

const dbName = "WebsiteSettingsDB";
const storeName = "backgrounds";
const bgKey = "userBackground";

function openWebsiteDB() {
  return new Promise(resolve => {
    const req = indexedDB.open(dbName, 1);

    req.onupgradeneeded = () =>
      req.result.createObjectStore(storeName);

    req.onsuccess = () =>
      resolve(req.result);
  });
}

async function useStore(mode, cb) {
  const db = await openWebsiteDB();
  return new Promise(resolve => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const req = cb(store);
    tx.oncomplete = () => resolve(req.result);
  });
}

async function setBackground(fileBlob) {
  await useStore("readwrite", s => s.put(fileBlob, bgKey));
  await applyBackgroundFromDB();
}

async function applyBackgroundFromDB() {
  const blob = await useStore("readonly", s => s.get(bgKey));
  if (blob) {
    const url = URL.createObjectURL(blob);
    localStorage.setItem("backgroundURL", url);
    document.documentElement.style.setProperty("--backgroundURL", `url(${url})`);
  }
}

const uploadDiv = document.getElementById("uploaddiv");
const fileInput = document.getElementById("fileInput");

if (uploadDiv && fileInput) {
  uploadDiv.onclick = () => fileInput.click();
  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (file?.type.startsWith("image/")) setBackground(file);
  };
}

function ghost3() {
  localStorage.setItem("onboarding", "");
  localStorage.setItem("galaxyVersion", 0);
  window.location.href = "/";
}
