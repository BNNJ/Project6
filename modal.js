
function add_listener() {
	document.querySelectorAll(".carousel__item")
		.forEach(el => el.querySelector("img").onclick = show_modal(el.dataset.id))
}

function show_modal(id) {
	var el = document.querySelector(".modal")
	// el.querySelector(".modal__content--close").onclick = function(){
	// 	hide_modal()
	// }
	el.onclick = function(event) {
		if (event.target == el) {
			hide_modal()
		}
	}

	get_movie_by_id(id)
		.then(data => {
			var content = el.querySelector(".modal__content")
			var img = content.querySelector("img")
			var desc = content.querySelector(".infos__content__desc")
			
			content.style = `background-image: url(${data.image_url})`
			img.src = data.image_url

			var date = data.date_published.split('-').join('/')
			var hours = Math.floor(data.duration/60)
			var minutes = (data.duration%60).toString().padStart(2, '0')
			var duration = `${hours ? hours + "h" : ""}${minutes}${hours ? "" : "m"}`
			var gross = data.worldwide_gross_income
				? new Intl.NumberFormat('en-US', {
						style: 'currency',
						currency: data.budget_currency || 'USD'
					})
					.format(data.worldwide_gross_income)
				: "unknown"

			desc.innerHTML = `
				<h1>${data.original_title}</h1>
				</br>
				<p>${data.countries.join(", ")} | ${data.genres.join(", ")} | ${date} | ${duration} | ${data.rated}</p>
				<p>imdb score: ${data.imdb_score} | box-office: ${gross}</p>
				<p>${data.directors ? "Directed by " + data.directors.join(", ") : "Director unknown"}
					| ${data.writers ? "Written by " + data.writers.join(", ") : "Writer unknown"}</p>
				<p>Actors: ${data.actors.join(" | ")}</p>
				<p>> ${data.long_description}</p>
				<div class="button"><p>&gt PLAY</p></div>
			`
		})

	el.classList.add("visible")
}

function hide_modal() {
	document.querySelector(".modal").classList.remove("visible")
}
