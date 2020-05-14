class Syllabus {

  constructor(syllabus, syllabusAttributes) {
    this.id = syllabus.id
    this.title = syllabusAttributes.title
    this.description = syllabusAttributes.description
    this.image_url = syllabusAttributes.image_url
    this.category = syllabusAttributes.category
    Syllabus.all.push(this)
  }

  renderSyllabusCard() {
    return `
      <div data-id=${this.id}>
        <img src=${this.image_url} height="200" width="250">
        <h3>${this.title}</h3>
        <p>${this.category.name}</p>
        <button data-id=${this.id}>edit</button>
      </div>
      <br><br>`;
  }

}

Syllabus.all = [];
