import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DocumentItem from './DocumentItem';
import InputFile from '../../components/Form/inputFile';
import { fetchFileAction } from '../../store/reducers/fileReducer';
import Utils from '../../Utils/utils';
import './index.css';

const mapStateToProps = ({ fileReducer, authReducer }) => ({
  fileProcess: fileReducer.fileProcess,
  loggedUser: authReducer.loginProcess.loggedUser,
});

const mapDispatchToProps = dispatch => ({
  fetchFile: file => {
    dispatch(fetchFileAction(file));
  },
});

class DisplayDocument extends React.Component {
  static propTypes = {
    files: PropTypes.array,
    fetchFile: PropTypes.func.isRequired,
    loggedUser: PropTypes.object.isRequired,
    fileProcess: PropTypes.object.isRequired,
    keyToUpdate: PropTypes.string,
    update: PropTypes.func,
    onDelete: PropTypes.func,
    editable: PropTypes.bool,
  };
  static defaultProps = {
    files: [],
    editable: false,
    keyToUpdate: null,
    update: null,
    onDelete: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      inputFile: '',
      uniqueKey: Math.random()
        .toString(36)
        .substr(2, 9),
    };
  }

  componentDidUpdate(prevProps) {
    const { fileProcess } = this.props;
    if (prevProps.fileProcess.file.name !== fileProcess.file.name) {
      const utils = new Utils();
      utils.simulateClickEvent(fileProcess.file);
    }
  }

  handleDownloadFile = file => {
    const { fetchFile } = this.props;
    fetchFile(file);
    this.setState(() => ({
      fileName: file.name,
    }));
  };

  handleInputFileChange = evt => {
    const { update, keyToUpdate } = this.props;
    const file = evt.target.files[0];
    if (file) {
      update({
        [keyToUpdate]: {
          value: file,
          changed: true,
        },
      });
    }
  };

  handleDrag = (evt, type) => {
    evt.stopPropagation();
    evt.preventDefault();
    this.setState(() => ({
      dragState: type,
    }));
  };

  handleDrop = evt => {
    evt.stopPropagation();
    evt.preventDefault();
    const { update, keyToUpdate } = this.props;
    const { dataTransfer } = evt;
    const file = dataTransfer.files[0];
    if (file) {
      update({
        [keyToUpdate]: {
          value: file,
          changed: true,
        },
      });
      this.setState(() => ({
        dragState: '',
      }));
    }
  };

  render() {
    const { files, onDelete, loggedUser, editable } = this.props;
    const { inputFile, uniqueKey } = this.state;
    return (
      <Fragment>
        <ul className="d-flex document">
          {files && files.length > 0 ? (
            files.map(file => {
              if (file) {
                return (
                  <li key={file.name}>
                    <DocumentItem
                      file={file}
                      onClick={this.handleDownloadFile}
                      readOnly={
                        file.author && loggedUser._id !== file.author._id
                      }
                      onDelete={onDelete}
                    />
                  </li>
                );
              }
              return (
                <div>
                  <span>No files available</span>
                </div>
              );
            })
          ) : (
            <div>
              <span>No files available</span>
            </div>
          )}
        </ul>
        {editable && (
          <InputFile
            config={{
              styleContainer: {
                padding: 0,
                flexDirection: 'row',
              },
              field: {
                label: 'Add File',
                name: `uploadFile-${uniqueKey}`,
                value: inputFile,
              },
              style: {
                padding: 0,
              },
              styleLabel: {
                padding: '0.5rem',
              },
              onChange: this.handleInputFileChange,
            }}
          />
        )}
      </Fragment>
    );
  }
}
const createContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
);
const DisplayDocumentContainer = createContainer(DisplayDocument);

export default DisplayDocumentContainer;
