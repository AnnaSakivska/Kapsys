// Full-page smooth scrolling with smooth-scrollbar - https://github.com/idiotWu/smooth-scrollbar
const anchors = document.querySelectorAll('a[href^="#"]')
const mainHomeContainer = document.querySelector('main')
const anchorsNotFromHome = document.querySelectorAll('a[id^="anchor-"]')
let anchorId
let requested = false

if (anchorsNotFromHome) {
  anchorsNotFromHome.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      localStorage.clear()
      const id = event.target.id.split('-')[1]
      localStorage.setItem("anchorId", id)
      localStorage.setItem('navigationFromOut', 'true')
    })
  })
}

if (mainHomeContainer) {
  anchorId = localStorage.getItem("anchorId")
  requested = localStorage.getItem("navigationFromOut")
  localStorage.clear()

  let Scrollbar = window.Scrollbar
  window.addEventListener("resize", initSmoothScrallBar)
  initSmoothScrallBar()

  function initSmoothScrallBar() {
    if (window.innerWidth < 768) {
      Scrollbar.destroy(mainHomeContainer)
      if (anchorId) document.querySelector(`.${anchorId}`).scrollIntoView()
    } else if (window.innerWidth > 768) {
      Scrollbar.init(mainHomeContainer, {
        speed: 0.7,
        damping: 0.04
      })
      const instance = Scrollbar.getAll()
      // make the anchors from other pages lead to curtain section at home
      if (requested && anchorId) {
        instance[0].scrollIntoView(document.querySelector(`.${anchorId}`), {
          offsetTop: 100
        })
      }
      // make the anchors from kapsys-home work
      anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          localStorage.clear()
          const anchorEl = document.querySelector(`.${this.getAttribute('href').substring(1)}`)
          instance[0].scrollIntoView(anchorEl, {
            offsetTop: 100
          })
        })
      })
    }
  }
}

// Showing active section
window.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('name')
      if (entry.intersectionRatio > 0) {
        if (id === 'blog') document.querySelector(`#blog-anchor`).classList.add('active-link')
        else document.querySelector(`a[href="#${id}"]`).classList.add('active-link')
      } else {
        if (id === 'blog') document.querySelector(`#blog-anchor`).classList.remove('active-link')
        else document.querySelector(`a[href="#${id}"]`).classList.remove('active-link')
      }
    })
  })

  // Track all sections that have an `id` applied
  document.querySelectorAll('a[name]').forEach((section) => {
    observer.observe(section)
  })
})

// Submit form 
let form = document.querySelector('.getInTouch__form')
function handleForm(event) {
  event.preventDefault()
  // show toast form message
  form.reset()
  const formTitle = document.querySelector('.form-title')
  formTitle.classList.add('form-toast')
  formTitle.innerHTML = `<h4>Thank you! <br class="b-screens-only t-display-none"> We will contact you as soon as possible.</h4>`

  setTimeout(() => {
    formTitle.classList.remove('form-toast')
    formTitle.innerHTML = `<h4>Let’s talk about how <br class="b-screens-only t-display-none"> we could help your business grow</h4>`
  }, 4000)
}
form.addEventListener('submit', handleForm)

// Menu Drop-down
const menuArrow = document.querySelector('.menu-arrow')
const allContainers = document.querySelectorAll('.kapsys-section')
const header = document.querySelector('.sticky-header')
const dropdownMenu = document.querySelector('.header-navbar')
const allAnchors = document.querySelectorAll('.header-navbar li a')

menuArrow.addEventListener('click', () => {
  const target = event.target
  target.classList.toggle('down')
  target.classList.toggle('up')

  function closeMenu() {
    dropdownMenu.classList.remove('navbar-active')
    document.documentElement.style.overflowY = 'auto'

    target.classList.add('down')
    target.classList.remove('up')
  }

  allContainers.forEach(container => container.style.zIndex = '0')
  document.documentElement.style.overflowY = 'auto'
  dropdownMenu.classList.toggle('navbar-active')
  if (target.classList.contains('up')) {
    allContainers.forEach(container => container.style.zIndex = '-1')
    document.documentElement.style.overflowY = 'hidden'
    dropdownMenu.classList.add('navbar-active')

    window.onclick = (ev) => { if (!ev.target.closest('.arrow') && !ev.target.closest('.navbar-active')) closeMenu() }

    allAnchors.forEach(anchor => anchor.addEventListener('click', () => closeMenu()))
  }
})

// Counter
const counters = document.querySelectorAll('.counter')
let speed = 200

counters.forEach(counter => {
  const updateCount = () => {
    const target = +counter.getAttribute('data-target')
    const count = +counter.innerText
    const inc = target / speed

    if (count < target) {
      counter.innerHTML = Math.ceil(count + inc)
      setTimeout(updateCount, 1)
    } else {
      counter.innerText = target
    }
  }
  updateCount()
})

// Industry focus section
const industryContainer = document.querySelector('.industry')
const industryTypeDOM = document.querySelectorAll('.industry-type')
const industryParagraphDOM = document.querySelector('.inductry__paragraph')
const indusrtyTypes = [
  {
    type: 'cyber-security',
    text: 'Kapsys helps to protect your valuable digital content, applications and devices with intuitive, people-centered and frictionless security.',
  },
  {
    type: 'insurance-solutions',
    text: 'We design innovative high-tech platforms that increase the value of service delivered by sales force, automate the collection and processing of clients data, manage contracts data and securely store sensitive data.',
  },
  {
    type: 'education-technology',
    text: 'We create sophisticated and highly customizable educational platforms and software systems for learning management, student monitoring, talent management, school management, and administration.',
  },
  {
    type: 'software',
    text: 'Kapsys delivers forward-thinking and innovative software solutions, technology consulting, core engineering and full-scale integration capabilities.',
  }
]

industryTypeDOM.forEach(type => type.addEventListener('click', openIndustryType))
function openIndustryType() {
  const target = event.target.closest('.industry-type')
  const industryType = target.getAttribute('data-industry-type')
  const typeObj = indusrtyTypes.find(el => el.type == industryType)
  industryTypeDOM.forEach(type => type.classList.remove('industry-type__active'))
  target.classList.add('industry-type__active')
  industryParagraphDOM.innerText = typeObj.text
  industryContainer.style.backgroundImage = `radial-gradient(circle at center, rgba(22, 21, 25, 0) 0, rgba(22, 21, 25, 0.2) 30%, 
                                        rgba(22, 21, 25, 0.4) 60%, rgb(22, 21, 25) 100%), 
                                        url('./assets/img/${typeObj.type}-min.png')`
}

// Blog Section
const blogCategories = document.querySelectorAll('.blog__sections li')

if (blogCategories) blogCategories.forEach(blog => blog.addEventListener('click', choseBlogCategory))

function choseBlogCategory() {
  localStorage.clear()
  const target = event.target.closest('.blog__option')
  if (mainHomeContainer) {
    const blogId = target.getAttribute('id')
    localStorage.setItem('blogId', blogId)
  }
  blogCategories.forEach(blog => blog.classList.remove('blog__active'))
  target.classList.add('blog__active')
}

// Add active blog theme when navigating to blog page
if (!mainHomeContainer && blogCategories && localStorage.getItem('blogId')) {
  document.getElementById(`${localStorage.getItem('blogId')}`).classList.add('blog__active')
  localStorage.clear()
}

// Atricles dropdown
const blogPopup = document.querySelector('.blog-popup')
const articleArrow = document.querySelector('.articles-arrow')
const dropdownArticles = document.querySelector('.blog__sections')
const allArticlesLinks = document.querySelectorAll('.blog__sections li')
const blogChosenCategory = document.querySelector('.blog-popup-title')

function closeArticlesPoP() {
  articleArrow.classList.remove('up')
  articleArrow.classList.add('down')
  dropdownArticles.classList.remove('active-articles-dropdown')
}

if (blogPopup) {
  blogPopup.addEventListener('click', () => {
    articleArrow.classList.toggle('up')
    articleArrow.classList.toggle('down')
    dropdownArticles.classList.toggle('active-articles-dropdown')

    if (articleArrow.classList.contains('up')) {
      dropdownArticles.classList.add('active-articles-dropdown')
      window.onclick = (ev) => { if (!ev.target.closest('.blog-popup__wrapper')) closeArticlesPoP() }
    }
  })

  allArticlesLinks.forEach(link => link.addEventListener('click', showActiveBlog))

  function showActiveBlog() {
    const target = event.target.closest('.blog__option')
    allArticlesLinks.forEach(link => link.classList.remove('blog__active'))
    target.classList.add('blog__active')
    blogChosenCategory.innerText = target.innerText
    closeArticlesPoP()
  }
}