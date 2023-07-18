import "./Sidebar.css";

function Sidebar() {
    return(
        <div className="w3-sidebar w3-light-grey w3-bar-block" style="width:25%">
            <h3 className="sidebar_item">Menu</h3>
            <a href="#" className="sidebar_item button">Link 1</a>
            <a href="#" className="sidebar_item button">Link 2</a>
            <a href="#" className="sidebar_item button">Link 3</a>
        </div>
    );
}

export default Sidebar;