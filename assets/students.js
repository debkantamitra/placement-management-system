console.log("connected!")

const match_list = document.getElementById('match-list')

// const outputHTML = matches => {
//     if (matches.length > 0) {
//       // map returns array from an array
//       const html = matches.map(
//           match => `
//             <h4>${match.name}</4>
//           `
//         ).join("");
  
//       console.log(html)
//     }

const search = document.getElementById('search').addEventListener('input', (e)=>{
    fetch("/students/api").then(res=> res.json()).then(data => {
        let matches = data.data.filter(foo => {
            // matches start of sentence based on the input, also contains the global and the case insensitive flags
            const regex = new RegExp(`^${e.target.value}`, "gi");
            // return array that matches those
            return foo.email.match(regex)
          });

          if (e.target.value.length === 0) {
            matches = [];
            // also remove the html after you removed the search terms
            match_list.innerHTML = "";
          }

          const html = matches.map(match => {
              return `
              <tr>
              <td>${match.name}</td>
              <td>${match.stream === 'bca' ? 'Bachelor of Computer Application': 'Bachelor of Business Administration'}</td>
              <td>${match.name} </td>
              <td>${match.status}</td>
              <td>
                <!-- Button trigger modal -->
                <button type="button" class="btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#staticBackdrop" id="buttonCheck">
                  Check
                  </button>
                  
                  <!-- Modal -->
                  <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="staticBackdropLabel">Other information</h5>
                        </div>
                        <div class="modal-body">
                            <span class="text-info">SSC percentage:</span> ${match.ssc_perc}
                          <br>
                          <span class="text-info"> HSC percentage:</span>:</span> ${match.hsc_perc}
                          <br>
                          <span class="text-info"> Graduation percentage:</span>:</span> ${match.grad_perc}
                          <br>
                          <span class="text-info"> No. of active baclogs:</span>:</span> ${match.backlog}
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                        </div>
                      </div>
                    </div>
                  </div>
              </td>
              <td><a href='/students/${match._id}' class="btn btn-outline-danger">Delete</a></td>   
            </tr>
              `
          }).join("")

          match_list.innerHTML = html
    })
})
