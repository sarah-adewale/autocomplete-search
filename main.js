$(document).ready( function (){
    $('#title').autocomplete({
        source: async function(request, response){
            let data = await fetch(`http://localhost:7000/search?query=${request.term}`)
                .then(results => results.json())
                .then(results => results.map(result => {
                    return{
                        label: result.title,
                        value: result.title,
                        id: result._id
                    }
                }))
                response(data)
        },
        minlength: 2,
        select: function(event, ui){
            console.log(ui.item.id)
            fetch(`http://localhost:7000/search/${ui.item.id}`)
                .then(result => result.json())
                .then(result => {
                    $('#cast').empty()
                    result.cast.forEach(cast => {
                        $(cast).append(`<li>$(cast)</li>`)
                    })
                    $('img').attr('src', result.poster)
                })
        }
    })
}

)