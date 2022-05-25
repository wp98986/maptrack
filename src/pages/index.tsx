import React from 'react';
import styles from './index.less';
import { Map, MapApiLoaderHOC, Polyline } from 'react-bmapgl';
import axios from 'axios';

class IndexPage extends React.Component {
  state = {
    path: [],
    center: {},
  };
  componentDidMount() {
    axios
      .get('./path.json')
      .then((res) => {
        const { data = [] } = res;
        const pathData = data.map((item) => {
          const { x, y } = item;
          return new BMapGL.Point(x, y);
        });
        this.setState({
          path: pathData,
          center: { lng: data[0].x, lat: data[0].y },
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  render() {
    const { path, center } = this.state;
    return (
      <div id="container" className={styles.aaa}>
        <div>轨迹生成</div>
        <div className={styles.content}>
          <Map
            center={center}
            zoom="11"
            style={{ width: 1080, height: '100%' }}
            enableScrollWheelZoom
          >
            {path && path.length > 0 && (
              <Polyline path={path} strokeColor="#f00" strokeWeight={2} />
            )}
          </Map>
        </div>
      </div>
    );
  }
}

export default IndexPage;

// export default MapApiLoaderHOC({ ak: 'a5YEmK3ChaYVRotHh2vXxafaeYIBjNuP' })(
//   IndexPage,
// );
