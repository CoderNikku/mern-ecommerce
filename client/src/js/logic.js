const openmenu = document.getElementById('menuicon')
const remove = document.getElementById('removeicon')
const nav = document.getElementById('homenav')

openmenu.addEventListener('click', function (e) {
    e.preventDefault()
    nav.classList.add('active')
    openmenu.style.display = "none"
    remove.style.display = "block"
})


remove.addEventListener('click', function (e) {
    e.preventDefault()
    nav.classList.add('active')
    openmenu.style.display = "block"
    remove.style.display = "none"
})