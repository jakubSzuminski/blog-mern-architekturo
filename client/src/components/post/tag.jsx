const Tag = ({ name, searchTag }) => {
    if(searchTag) return <button className="tag" onClick={searchTag}> {name} </button>
    return <button className="tag">{name}</button>
}

export default Tag;