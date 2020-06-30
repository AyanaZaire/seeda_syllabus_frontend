class Syllabus {

  constructor(syllabus, syllabusAttributes) {
    this.id = syllabus.id
    this.title = syllabusAttributes.title
    this.description = syllabusAttributes.description
    this.image_url = syllabusAttributes.image_url
    this.category = syllabusAttributes.category
    Syllabus.all.push(this)
    console.log(this);
  }

  renderSyllabusCard() {
    return `
      <div class="col-md-4">
        <div class="card mb-4 shadow-sm">
          <img src=${this.image_url} class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${this.title}</h5>
            <p class="card-text">${this.description}</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="btn-group">
                <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
              </div>
              <small class="text-muted">Category: ${this.category.name}</small>
            </div>
          </div>
        </div>
      </div>

    `
    // return `
    //   <div data-id=${this.id}>
    //     <img src=${this.image_url} height="200" width="250">
    //     <h3>${this.title}</h3>
    //     <p>${this.category.name}</p>
    //     <button data-id=${this.id}>edit</button>
    //   </div>
    //   <br><br>`;
  }

}

Syllabus.all = [];
