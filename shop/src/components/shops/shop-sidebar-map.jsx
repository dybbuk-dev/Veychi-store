import GoogleMapReact from 'google-map-react';

const position = [51.505, -0.09];

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function SimpleMap({ location }) {
  if (!location) return <></>;
  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '500px', width: '100%' }}>
      <GoogleMapReact
        options={{
          scrollwheel: true,
        }}
        bootstrapURLKeys={{ key: 'AIzaSyDu5MNkinB4TmnyRixzuu9SIbUeZY-dPGo' }}
        defaultCenter={location}
        defaultZoom={13}
      >
        <Icon lat={location.lat} lng={location.lng} text="My Marker" />
      </GoogleMapReact>
    </div>
  );
}

const Icon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6 text-red-500"
  >
    <path
      fillRule="evenodd"
      d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
      clipRule="evenodd"
    />
  </svg>
);
