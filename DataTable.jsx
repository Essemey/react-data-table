import { useState, useMemo, Children, useEffect, useCallback } from 'react'
import { Table } from "./Table";
import './styles/DataTable.css'
import { NavigationButtons } from './NavigationButtons';
import { sortData } from './sortData';
import { SearchIcon } from './icons/SearchIcon';


export default function DataTable({ title, data, setData, children }) {

    //On mémoize (le retour de la fonction) columns pour éviter de créer des rendus supplémentaire pour DataRow qui est un composant pur
    const columns = useMemo(() => Children.toArray(children), [])

    const [page, setPage] = useState({ entries: 5, pages: 0, current: 0, content: [] })
    const [activeColumn, setActiveColumn] = useState({ column: null, order: false })
    const [research, setResearch] = useState({ text: '', content: [] })

    const calculPages = (entriesP, dataLength) => {

        const entries = entriesP || page.entries
        const dataSize = dataLength || data.length

        let pages = Math.floor((dataSize / entries))
        //Si la taille du tableau est un multiple de entries alors on enlève une page
        if ((dataSize % entries === 0)) pages = pages - 1

        return pages
    }


    //Quand on active un filtre
    useEffect(() => {

        if (activeColumn.column && data.length) {
            if (research.text !== '') {
                return changePage(page.current, true, null, null, data)
            }
            changePage(page.current, true)
        }

    }, [activeColumn])




    useEffect(() => {

        //Si on a une recherche et que l'élément qu'on ajoute a besoin de créer une autre page avec les données recherchées
        if (research.text !== '') {

            const { id, ...parameters } = data[data.length - 1]
            //Si le dernier ajout correspond aux critères de recherche
            if (Object.values(parameters).find(props => props.indexOf(research.text) !== -1)) {


                //On regarde le nombre de pages qu'il faut pour content plus la donnée qu'on ajoute
                const pages = calculPages(null, research.content.length + 1)

                //Si le nombre de page n'a pas changé inutile de faire un rendu
                if (pages !== page.pages) setPage(s => ({ ...s, pages: pages }))

                /*Si les données n'ont pas besoin d'etre trié on peut directement utilisé le tableau
                trié par la recherche + la donnée ajoutée */
                const searchedData = [...research.content, data[data.length - 1]]
                //Si les données ont besoin d'etre triées
                let sortedData = null
                if (activeColumn.column) {
                    sortedData = sortData(activeColumn.column.type, activeColumn.order, activeColumn.column.data, data)
                    setData(data => sortedData)
                }

                //Si on ajoute une donnée sur la dernière page et qu'on est sur le point de changer de page on change de page
                if ((page.pages && page.current) && (page.pages === page.current) && (pages !== page.pages)) {
                    return changePage(page.current + 1, true, pages, null, sortedData || searchedData)
                }

                return changePage(page.current, true, pages, null, sortedData || searchedData)
            }

        }



        //A chaque fois qu'on ajoute un employé si on a un filtre actif et qu'on a pas plusieurs page, alors on trie les données
        if (activeColumn.column && data.length && !page.pages) {
            setData(data => sortData(activeColumn.column.type, activeColumn.order, activeColumn.column.data, data))
        }

        if (data.length > page.entries) { //Si on a besoin de plusieurs pages

            const pages = calculPages()
            //Si le nombre de page n'a pas changé inutile de faire un rendu 
            if (pages !== page.pages && research.text === '') setPage(s => ({ ...s, pages: pages }))
            /*Si on ajoute une donnée sur la dernière page et qu'on est sur le point de changer de page on change de page 
            et qu'un filtre est activé*/
            if ((page.pages && page.current) && (page.pages === page.current) && (pages !== page.pages) && activeColumn.column) {

                const sortedData = sortData(activeColumn.column.type, activeColumn.order, activeColumn.column.data, data)

                setData(d => sortedData)

                if (research.text !== '') return changePage(page.current, true, null, null, sortedData)
                return changePage(page.current + 1, true, pages, null, sortedData)
            }

            //Si un filtre est activé est qu'on ajoute une donnée
            if (activeColumn.column) {
                const sortedData = sortData(activeColumn.column.type, activeColumn.order, activeColumn.column.data, data)
                changePage(page.current, true, null, null, sortedData)
                return setData(d => sortedData)
            }

            //Si c'est le premier rendu, on rend la première page de données
            if (!page.pages && !page.content.length) {
                return changePage(0, true)
            }

            //Si on ajoute une donnée sur la dernière page et qu'on est pas sur le point de changer de page on veut la voir
            if ((page.pages && page.current) && (page.pages === page.current) && (pages === page.pages)) {
                return changePage(page.current, true)
            }

            //Si on ajoute une donnée sur la dernière page et qu'on est sur le point de changer de page on change de page
            if ((page.pages && page.current) && (page.pages === page.current) && (pages !== page.pages)) {
                if (research.text !== '') return changePage(page.current, true)
                return changePage(page.current + 1, true, pages)
            }

        }
    }, [data.length])



    const order = column => column === activeColumn.column?.data ? !activeColumn.order : true

    //On mémoize la fonction pour eviter de créer de nouveaux rendu pour DataColumns
    const handleSort = useCallback(column => {
        setData(data => sortData(column.type, order(column.data), column.data, data))
        setActiveColumn(c => ({ ...c, column: column, order: order(column.data) }))
    }, [activeColumn]) //On passe activeColumns comme dépendance car on veut mettre a jour la fonction si activeColumn change



    const changePage = (pageNumber, render = false, pagesP, entriesP, ownData) => {

        if (page.current === pageNumber && !render) { //Si on reste sur la meme page inutitle de faire un autre rendu
            return
        }

        const pages = pagesP || page.pages
        const entries = entriesP || page.entries
        let data_ = ownData || data

        if (research.text !== '') {
            //Si on ajoute une donnée ou qu'on saisit une recherche
            if (ownData) {
                //Si le tableau recu est déja trié par la recherche
                data_ = ownData

                //Si le tabelau recu est trié mais pas filtré par la recherche
                if (Array.isArray(ownData) && ownData.length === data.length) {
                    console.log('hereNo')
                    data_ = data.filter(obj => {
                        const { id, ...parameters } = obj
                        return (Object.values(parameters).find(props => props.indexOf(research.text) !== -1))
                    })
                }

                //Si la recherche est vide ou correspond à toute les données
                if (ownData === 'data') {
                    data_ = data
                    //On met a jour le content de research
                    setResearch(r => ({ ...r, content: [] }))
                } else {
                    //On met a jour le content de research
                    setResearch(r => ({ ...r, content: data_ }))
                }

            } else { /*Quand on change de page, ou qu'on demande un trie, */

                //Si on demande que le changement de page
                data_ = research.content

                //Pour le tri, on prefere trier le tableau filtré par la recherche plutot que de filtré le tableau trié
                if (activeColumn.column) {
                    data_ = sortData(activeColumn.column.type, activeColumn.order, activeColumn.column.data, research.content)
                }
            }
        }

        let first
        let second

        if (pageNumber === 0) { //Première page
            first = 0
            second = first + (entries - 1)
        }
        else if (pageNumber === pages) { //Dernière page
            if (data_.length % entries === 0) { //Si c'est un multiple d'entries
                console.log('mutiple')
                first = data_.length - entries
            } else {
                first = data_.length - (data_.length % entries)
            }
            second = data_.length - 1
        } else { //Autres pages

            const multiplicator = pages - pageNumber + 1

            if (data_.length % entries === 0) {
                console.log('middle multiple')
                first = data_.length - (entries * multiplicator)
            } else {
                console.log('middle no multiple')
                first = (Math.ceil(data_.length / entries) * entries) - (entries * multiplicator)
                console.log((Math.ceil(data_.length / entries) * entries))
            }

            second = first + (entries - 1)
        }

        const pageData = data_.filter((obj, index) => index >= first && index <= second)
        setPage(s => ({ ...s, current: pageNumber, content: pageData }))


    }

    const handleEntries = value => {

        const entries = parseInt(value, 10)

        if (Number.isNaN(entries)) return

        if (research.text !== '') {
            if (research.content.length <= entries) {
                return setPage(d => ({ ...d, current: 0, pages: 0, entries: entries }))
            }

            console.log('superieur')
            const pages = calculPages(entries, research.content.length)

            changePage(0, true, pages, entries, research.content)
            return setPage(s => ({ ...s, pages: pages, entries: entries }))
        }

        //Si on a moins de données que le nombre d'entrées on affiche tout sur une page
        if (data.length <= entries) setPage(d => ({ ...d, content: [], current: 0, pages: 0, entries: entries }))

        if (data.length > entries) {

            const pages = calculPages(entries)

            changePage(0, true, pages, entries)
            setPage(s => ({ ...s, pages: pages, entries: entries }))
        }

    }

    const handleSearch = (value) => {

        const searchedData = data.filter(obj => {
            const { id, ...parameters } = obj
            return (Object.values(parameters).find(props => props.indexOf(value) !== -1))
        })

        //Si la recherche ne donne rien
        if (searchedData.length === 0) {
            changePage(0, true, 0, null, searchedData)
            setPage(s => ({ ...s, pages: 0 }))
            return setResearch(r => ({ ...r, text: value, content: searchedData }))
        }

        const pages = calculPages(null, searchedData.length)

        //Si on a aucune recherche ou que la recherche correspond à toute les données
        if ((value === '' || searchedData.length === data.length) && research.text !== '') {
            console.log('ici')
            changePage(0, true, pages, null, 'data')
            setPage(s => ({ ...s, pages: pages }))
            return setResearch(r => ({ ...r, text: value, content: [] }))
        }


        changePage(0, true, pages, null, searchedData)
        setPage(s => ({ ...s, pages: pages }))
        setResearch(r => ({ ...r, text: value, content: searchedData }))

    }


    return <div className="data_table_container">
        <div className="data_table_header">
            <select onChange={(e) => handleEntries(e.target.value)}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
            <h1>{title}</h1>
            <div className="data_table_search">
                <input type="text" placeholder="Search..." value={research.text} onInput={(e) => handleSearch(e.target.value)} />
                <SearchIcon />
            </div>
        </div>
        <Table data={!page.pages && research.text === '' ? data : page.content}
            setData={setData} columns={columns} activeColumn={activeColumn} handleSort={handleSort} research={research} />
        {page.pages ? <NavigationButtons pagesNumber={page.pages} currentPage={page.current} changePage={changePage} /> : null}
    </div>
}