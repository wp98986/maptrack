import React from 'react';
import styles from './index.less';
import { Map, Polyline, Marker, CustomOverlay } from 'react-bmapgl';
import axios from 'axios';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const colorEnum = ['#ff6633', '#999933', '#ff66ff', '#66cccc', '#00ccff'];
class IndexPage extends React.Component {
  state = {
    path: [],
    center: new BMapGL.Point(),
    allPoint: [],
  };
  componentDidMount() {
    var geolocation = new BMapGL.Geolocation();
    var context = this;
    geolocation.getCurrentPosition(function (r) {
      if (this.getStatus() == BMAP_STATUS_SUCCESS) {
        // alert('您的位置：' + r.point.lng + ',' + r.point.lat);
        context.setState({
          center: new BMapGL.Point(r.point.lng, r.point.lat),
        });
      } else {
        console.error('failed' + this.getStatus());
      }
    });
  }

  handle() {
    axios
      .get('nodeapi/handle')
      .then((res) => {
        const { data } = res;
        console.log(res.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  uploadChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功！`);
      const { response: resData = [] } = info.file;

      this.setState({
        allPoint: resData,
      });
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  }

  renderPath() {
    const { allPoint = [] } = this.state;
    const polylineData = allPoint.map((item, index) => {
      const { data = [] } = item;
      const pathData = data
        .filter((f) => f[2] || f[3])
        .map((d) => {
          const [x, y] = [d[2], d[3]];
          if (x || y) return new BMapGL.Point(x, y);
        });
      const aIndex = index % 5;
      if (pathData && pathData.length > 0) {
        return (
          <Polyline
            key={index}
            path={pathData}
            strokeColor={colorEnum[aIndex]}
            strokeWeight={2}
            enableDragging={false}
          />
        );
      }
    });
    return polylineData;
  }

  renderOverlay() {
    const { allPoint = [] } = this.state;

    const dataArr = allPoint.reduce((current, item) => {
      const { data = [] } = item;
      if (data.length) return current.concat(data);
      else return current;
    }, []);

    const overlayData = dataArr.map((item, index) => {
      return (
        <CustomOverlay
          key={index}
          position={new BMapGL.Point(item[2], item[3])}
        >
          <div className={styles.custom}>
            <div className={styles.customChild}>时间：{item[1]}</div>
          </div>
        </CustomOverlay>
      );
    });
    return overlayData;
  }

  render() {
    const { center } = this.state;

    const props: UploadProps = {
      name: 'file',
      action: 'nodeapi/upload',
      headers: {
        authorization: 'authorization-text',
      },
    };

    return (
      <div id="container" className={styles.aaa}>
        <div onClick={this.handle.bind(this)}>轨迹生成</div>
        <Upload {...props} onChange={this.uploadChange.bind(this)}>
          <Button icon={<UploadOutlined />}>上传路径</Button>
        </Upload>
        <div className={styles.content}>
          <Map
            center={center}
            zoom="11"
            style={{ width: '100%', height: '100%' }}
            enableScrollWheelZoom
          >
            {this.renderPath()}
            {this.renderOverlay()}

            {/* <Marker position={center} enableDragging /> */}
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
