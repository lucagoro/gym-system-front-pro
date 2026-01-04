import "../css/SearchBar.css";

export default function SearchBar({ value, onChange }) {
    return (
        <div className="search-bar">
            <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Buscar por apellido"></input>
        </div>
    )
}