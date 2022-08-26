import { request } from './api/api.js';
import Nodes from './Nodes.js';
import ImageViewer from './ImageViewer.js';
import Loading from './Loading.js';
import Breadcrumb from './Breadcrumb.js';
import { API_END_POINT } from './constants/api.js';

export default function App({ $target }) {
  this.state = {
    isRoot: true,
    isLoading: false,
    nodes: [],
    paths: [],
  };

  const loading = new Loading({
    $target,
  });

  const breadcrumb = new Breadcrumb({
    $target,
    initialState: this.state.paths,
    onClick: async (id) => {
      // 클릭한 경로 외의 패스 날려주기
      if (id) {
        const nextPaths = id ? [...this.state.paths] : [];
        const pathIndex = nextPaths.findIndex((path) => path.id === id);
        this.setState({
          ...this.state,
          paths: nextPaths.slice(0, pathIndex + 1),
        });
      } else {
        this.setState({
          ...this.state,
          paths: [],
        });
      }

      await fetchNodes(id);
    },
  });

  const nodes = new Nodes({
    $target,
    initialState: {
      isRoot: this.state.isRoot,
      nodes: this.state.nodes,
      selectedImageUrl: null,
    },
    onClick: async (node) => {
      if (node.type === 'DIRECTORY') {
        await fetchNodes(node.id);
        this.setState({
          ...this.state,
          paths: [...this.state.paths, node],
        });
      }
      if (node.type === 'FILE') {
        this.setState({
          ...this.state,
          selectedImageUrl: `${API_END_POINT}/static${node.filePath}`,
        });
      }
    },
    onPrevClick: async () => {
      const nextPaths = [...this.state.paths];
      nextPaths.pop();
      this.setState({
        ...this.state,
        paths: nextPaths,
      });
      if (nextPaths.length === 0) {
        await fetchNodes();
      } else {
        await fetchNodes(nextPaths[nextPaths.length - 1].id);
      }
    },
  });

  const imageViewer = new ImageViewer({
    $target,
    onClose: () => {
      this.setState({
        ...this.state,
        selectedImageUrl: null,
      });
    },
  });

  this.setState = (nextState) => {
    this.state = nextState;

    nodes.setState({
      isRoot: this.state.isRoot,
      nodes: this.state.nodes,
    });

    imageViewer.setState({
      selectedImageUrl: this.state.selectedImageUrl,
    });

    loading.setState(this.state.isLoading);

    breadcrumb.setState(this.state.paths);
  };

  const fetchNodes = async (id) => {
    this.setState({
      ...this.state,
      isLoading: true,
    });
    const nodes = await request(id ? `/${id}` : '/');
    this.setState({
      ...this.state,
      nodes,
      isRoot: id ? false : true,
      isLoading: false,
    });
  };

  fetchNodes();
}
