// const fetch = require("node-fetch")

const base_url = "http://localhost:8000/api/v1/titles/"

const categories = [
	{id: "best",	title: "Best ratings",		genre: ""},
	{id: "cat1",	title: "Fantasy",			genre: "Fantasy"},
	{id: "cat2",	title: "Science Fiction",	genre: "Sci-Fi"},
	{id: "cat3",	title: "Mystery",			genre: "Mystery"}
]

function check_response(response) {
	if (response.ok) {
		return response
	}
	else {
		throw Error(response.statusText)
	}
}

function get_page(url) {
	return fetch(url)
		.then(check_response)
		.then(response => response.json())
		.catch(error => console.log(error))
}

function get_movie_by_id(id) {
	return get_page(base_url + id)
}

function get_highlight() {
	if (document.getElementById("highlight").dataset.mode === "random") {
		return get_page(base_url + "?sort_by=-imdb_score")
			.then(data => data.results.filter(m => m.imdb_score === data.results[0].imdb_score))
			.then(data => data[Math.floor(Math.random() * data.length)])
			.then(movie => get_movie_by_id(movie.id))
	}
	else {
		return get_page(base_url + "?sort_by=-imdb_score")
			.then(data => data.results.reduce(
				(acc, cur) => (cur.imdb_score < acc.imdb_score || cur.avg_vote < acc.avg_vote) ? acc : cur)
			)
			.then(movie => get_movie_by_id(movie.id))
	}
}
// function get_highlight() {
// }

function get_movies(genre, number, sort_by="-imdb_score") {
	const url = base_url + "?genre=" + genre + "&sort_by=" + sort_by
	pages = [...Array(1 + (number/5|0)).keys()].map(x => get_page(url + "&page=" + (x+1)))
	return Promise.all(pages)
		.then(data => data.map(x => x.results))
		.then(data => [].concat(...data).slice(0, number))
}

function render_category(id, genre, title) {
	const cat_elmt = document.getElementById(id)
	cat_elmt.querySelector(".title").innerHTML = title
	get_movies(genre, 7)
		.then(data => data.map(m => (
			`<div class="carousel__item" data-id="${m.id}">
				<img src="${m.image_url}" onclick="show_modal(${m.id})">
			</div>`
		)))
		.then(data => cat_elmt.querySelector(".carousel__gallery").innerHTML = data.join(''))
}

function render() {
	categories.forEach(cat => render_category(cat.id, cat.genre, cat.title))
	get_highlight()
		.then(data => {
			hl = document.getElementById("highlight")
			hl.style = `background-image: url(${data.image_url})`
			hl.dataset.id = data.id
			img = hl.querySelector(".image")
			img.src = data.image_url
			desc = hl.querySelector(".infos__content__desc")
			desc.innerHTML = `
				<h1>${data.original_title}</h1>
				</br>
				</br>
				<p>${data.description}</p>
				<br>
				<br>
				<div class="button"><p>&gt PLAY</p></div>
				<div class="button" onclick="show_modal(${data.id})"><p>! INFO</p></div>
			`
		})
}

// get_movies("fantasy", 10)
// 	.then(data => data.forEach(x => console.log(x.directors)))