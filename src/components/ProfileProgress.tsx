import './ProfileProgress.css'

interface ProfileProgressProps {
  percentage: number
  missingFields: string[]
}

const ProfileProgress = ({ percentage, missingFields }: ProfileProgressProps) => {
  return (
    <div className="profile-progress">
      <div className="profile-progress-header">
        <h2>Hoàn thiện hồ sơ</h2>
        <div className="progress-percentage">{percentage}%</div>
      </div>
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>

      {missingFields.length > 0 && (
        <div className="missing-fields">
          <p className="missing-fields-title">Các mục còn thiếu:</p>
          <ul>
            {missingFields.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        </div>
      )}

      {percentage === 100 && (
        <div className="profile-complete">
          ✅ Hồ sơ của bạn đã hoàn thiện!
        </div>
      )}
    </div>
  )
}

export default ProfileProgress

