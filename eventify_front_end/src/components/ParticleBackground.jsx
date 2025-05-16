// // src/components/ParticleBackground.jsx
// import { useEffect, useMemo, useState } from "react";
// import Particles, { initParticlesEngine } from "@tsparticles/react";
// import { loadSlim } from "@tsparticles/slim";

// const ParticleBackground = () => {
//   const [init, setInit] = useState(false);

//   useEffect(() => {
//     initParticlesEngine(async (engine) => {
//       await loadSlim(engine);
//     }).then(() => setInit(true));
//   }, []);

//   const options = useMemo(() => ({
//     fullScreen: {
//       enable: true,
//       zIndex: -1,
//     },
//     background: {
//       color: { value: "transparent" },
//     },
//     fpsLimit: 60,
//     interactivity: {
//       events: {
//         onClick: { enable: true, mode: "push" },
//         onHover: { enable: true, mode: "repulse" },
//       },
//       modes: {
//         push: { quantity: 4 },
//         repulse: { distance: 150, duration: 0.4 },
//       },
//     },
//     particles: {
//       color: { value: "#38bdf8" },
//       links: {
//         color: "#38bdf8",
//         distance: 130,
//         enable: true,
//         opacity: 0.4,
//         width: 1,
//       },
//       move: {
//         enable: true,
//         speed: 2,
//         direction: "none",
//         outModes: { default: "bounce" },
//       },
//       number: {
//         value: 120,
//         density: { enable: true, area: 800 },
//       },
//       opacity: { value: 0.5 },
//       shape: { type: "circle" },
//       size: { value: { min: 1, max: 3 } },
//     },
//     detectRetina: true,
//   }), []);

//   return init ? (
//     <Particles id="tsparticles" options={options} />
//   ) : null;
// };

// export default ParticleBackground;
// src/components/ParticleBackground.jsx
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticleBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const options = useMemo(() => ({
    fullScreen: {
      enable: false, // ✅ disable fullscreen mode
    },
    background: {
      color: { value: "transparent" },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: { enable: true, mode: "push" },
        onHover: { enable: true, mode: "repulse" },
      },
      modes: {
        push: { quantity: 4 },
        repulse: { distance: 150, duration: 0.4 },
      },
    },
    particles: {
      color: { value: "#38bdf8" },
      links: {
        color: "#38bdf8",
        distance: 130,
        enable: true,
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        outModes: { default: "bounce" },
      },
      number: {
        value: 120,
        density: { enable: true, area: 800 },
      },
      opacity: { value: 0.5 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  }), []);

return init ? (
  // <Particles
  //   id="tsparticles"
  //   options={options}
  //   style={{
  //     position: "absolute",    // ✅ make it float
  //     top: 0,
  //     left: 0,
  //     width: "100%",
  //     height: "100%",
  //     zIndex: 2,
  //     pointerEvents: "none",   // allow clicks through
  //   }}
  // />
  <Particles
  id="tsparticles"
  options={options}
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    pointerEvents: 'none'
  }}
/>

) : null;

};

export default ParticleBackground;
