const endPoint = "http://localhost:3000/api/v1/syllabuses"

document.addEventListener('DOMContentLoaded', () => {
  getSyllabi()
})

function getSyllabi() {
  fetch(endPoint)
  .then(response => response.json())
  .then(syllabi => {
    syllabi.data.forEach(syllabus => {
        // double check how your data is nested in the console so you can successfully access the attributes of each individual object
        const syllabusMarkup = `
          <div data-id=${syllabus.id}>
            <img src=${syllabus.attributes.image_url} height="200" width="250">
            <h3>${syllabus.attributes.title}</h3>
            <p>${syllabus.attributes.category.name}</p>
            <button data-id=${syllabus.id}>edit</button>
          </div>
          <br><br>`;

          document.querySelector('#syllabus-container').innerHTML += syllabusMarkup
      })
    })
}
