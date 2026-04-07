import { useNavigate } from "react-router-dom";

function Dashboard_card(props){
    const navigate = useNavigate();
    return (
        <div
            key={props.posting.id}
            className="dash-card"
            style={{ animationDelay: `${props.index*50}ms` }}
            onClick={() =>
                navigate(`/dashboard/posting/${props.posting.id}`, {
                state: { posting: props.posting },
              })
            }
        >
                <div className="dash-card-left">
                  <span className="dash-card-index">
                    {String(props.index + 1).padStart(2, "0")}
                  </span>
                  <div className="dash-card-info">
                    <span className="dash-card-company">{props.posting.company}</span>
                    <span className="dash-card-role">{props.posting.role}</span>
                  </div>
                </div>
                <div className="dash-card-right">
                  <span
                    className={`dash-card-deadline ${props.isUrgent ? "urgent" : ""}`}
                  >
                    {props.isUrgent ? "⚠ " : ""}
                    {props.daysLeft > 0 ? `${props.daysLeft}d left` : "Closed"}
                  </span>
                  <span className="dash-card-arrow">→</span>
                </div>
              </div>
    )
}
export default Dashboard_card