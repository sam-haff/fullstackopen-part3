const Filter = ({filterValue, setFilterValue}) => {
    const onFilterChange = (e) => setFilterValue(e.target.value)

    return (
        <div>
            filter shown with<input value={filterValue} onChange={onFilterChange}/>
        </div>
    )
}

export default Filter