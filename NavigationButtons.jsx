

export function NavigationButtons({ pagesNumber, currentPage, changePage }) {

    const buttons = []

    const className = i => currentPage === i ? 'button_active' : ''

    !currentPage ? //Si on est sur la première page on ne peut pas revenir en arrière
        buttons.push(<button key="prev_key" className="button_disabled">Previous</button>)
        :
        buttons.push(<button key="prev_key" onClick={() => changePage(currentPage - 1)}>Previous</button>)

    for (let i = 0; i <= pagesNumber; i++) {
        console.log('slslsl')
        buttons.push(
            <button key={i} className={className(i)} onClick={() => changePage(i)}>
                {i + 1}
            </button>)
    }

    currentPage === pagesNumber ? //Si on est sur la dernière page on ne peut pas aller plus loin
        buttons.push(<button key="next_key" className="button_disabled">Next</button>)
        :
        buttons.push(<button key="next_key" onClick={() => changePage(currentPage + 1)}>Next</button>)

    return <div className="navigation_buttons">{buttons}</div>

}