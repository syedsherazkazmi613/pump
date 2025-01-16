
window.addEventListener('load', () => {
    const loaderWrapper = document.querySelector('.loader-wrapper');
    const circleLoader = document.querySelector('.circle-loader');
    const progressBar = document.querySelector('.progress-bar');
    
    const tl = gsap.timeline();
    tl.to(circleLoader, {
      rotation: 360,
      duration: 1,
      repeat: -1,
      ease: "none"
    })
    .to(progressBar, {
      width: "100%", 
      duration: 1.5,
      ease: "power1.inOut"
    })
    .to(loaderWrapper, {
      y: "-100%",
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        loaderWrapper.style.display = 'none';
      }
    })
    // Content animations
    .from("h1", {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "power4.out"
    })
    .from("h1 span", {
      scale: 0.5,
      opacity: 0,
      duration: 0.5,
      ease: "back.out(1.7)"
    }, "-=0.5")
    .from("p", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out"
    }, "-=0.3")
    .from("a.bg-white", {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: "back.out(1.7)"
    }, "-=0.5")
    gsap.from("img", {
      x: 100,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      delay: 3
    })
    .from(".overflow-x-hidden", {
      backgroundPosition: "200% 0",
      duration: 1.5,
      ease: "power2.out"
    });

    // Add hover animation for the CTA button
    gsap.to("a.bg-white", {
      scale: 1.05,
      duration: 0.3,
      paused: true,
      ease: "power1.out"
    });
  });

// GSAP CDN
gsap.registerPlugin(ScrollTrigger);


function initScrollAnimations() {
    // Set initial width
    gsap.set('.bg-black1', {
        width: '80%'
    });

    // Create scroll animation
    ScrollTrigger.create({
        trigger: '.bg-black1',
        start: "top center",
        end: "bottom center",
        onEnter: () => {
            gsap.to('.bg-black1', {
                width: '100%',
                duration: 0.3,
                ease: "power2.inOut"
            });
        },
        onLeaveBack: () => {
            gsap.to('.bg-black1', {
                width: '80%',
                duration: 0.3,
                ease: "power2.inOut"
            });
        }
    });
}

// Initialize after DOM is loaded
document.addEventListener('DOMContentLoaded', initScrollAnimations);