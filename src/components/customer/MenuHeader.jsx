export default function MenuHeader({ profile }) {
  return (
    <div className="menu-header">
      {profile.logoImage ? (
        <img className="menu-logo menu-logo-img" src={profile.logoImage} alt={profile.name} />
      ) : (
        <div className="menu-logo">{profile.logoLetter}</div>
      )}
      <h1>{profile.name}</h1>
      <p className="menu-tagline">{profile.tagline}</p>
      <div className="menu-meta">
        <span>{profile.address}</span>
        <span className="dot">•</span>
        <span>{profile.hours}</span>
      </div>
    </div>
  );
}
