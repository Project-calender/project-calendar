import React, { useContext } from 'react';
import styles from './style.module.css';
import PropTypes from 'prop-types';
import Modal from '../../common/Modal';
import { EventBarContext } from '../../../context/EventBarContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBarsStaggered,
  faBell,
  faBriefcase,
  faCalendarDay,
  faCaretDown,
  faCircleQuestion,
  faClock,
  faGripLines,
  faLocationDot,
  faLock,
  faPaperclip,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';

const Index = ({ hideModal, style }) => {
  const { setNewEventBars } = useContext(EventBarContext);

  function handleModal() {
    setNewEventBars([]);
    hideModal();
  }

  return (
    <Modal
      hideModal={handleModal}
      isCloseButtom={true}
      isBackground={true}
      style={{ ...style, boxShadow: '2px 10px 24px 10px rgb(0, 0, 0, 0.25)' }}
    >
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <FontAwesomeIcon icon={faGripLines} />
        </div>
        <div className={styles.modal_context}>
          <div>
            <div />
            <input
              className={styles.event_title_input}
              type="text"
              placeholder="제목 및 시간 추가"
            />
          </div>

          <div>
            <div />
            <div className={styles.modal_context_category}>
              <button className={styles.category_active}>이벤트</button>
              <button>할 일</button>
            </div>
          </div>

          <div>
            <FontAwesomeIcon icon={faClock} />
            <div style={{ width: '62%' }}>
              <h3>5월 31일(화요일) - 5월31일(화요일)</h3>
              <h5>반복 안함</h5>
            </div>
            <button className={styles.time_add_button}>시간 추가</button>
          </div>

          <div>
            <div />
            <button className={styles.time_find_button}>시간 찾기</button>
          </div>
          <div>
            <FontAwesomeIcon icon={faUserGroup} />
            <h4>참석자 추가</h4>
          </div>

          <div className={styles.google_meet}>
            <img
              className={styles.google_meet_img}
              src={`${process.env.PUBLIC_URL}/img/google_meet_icon.png`}
              alt="구글 미팅"
            />
            <button>
              <b>Google Meet</b> 화상 회의 추가
            </button>
          </div>

          <div className={styles.modal_line} />
          <div>
            <FontAwesomeIcon icon={faLocationDot} />
            <h4>위치 추가</h4>
          </div>

          <div className={styles.modal_line} />
          <div>
            <FontAwesomeIcon icon={faBarsStaggered} />
            <h4>설명 추가</h4>
          </div>
          <div>
            <FontAwesomeIcon icon={faPaperclip} />
            <h4>첨부파일 추가</h4>
          </div>

          <div className={styles.modal_line} />
          <div>
            <FontAwesomeIcon icon={faCalendarDay} />
            <div className={styles.calendar_info}>
              <h3>
                내 캘린더
                <FontAwesomeIcon
                  className={styles.caret_down}
                  icon={faCaretDown}
                />
              </h3>
              <div className={styles.calendar_info_colors} />
              <FontAwesomeIcon
                className={styles.caret_down}
                icon={faCaretDown}
              />
            </div>
          </div>

          <div>
            <FontAwesomeIcon icon={faBriefcase} />
            <div>
              <h3>
                한가함
                <FontAwesomeIcon
                  className={styles.caret_down}
                  icon={faCaretDown}
                />
              </h3>
            </div>
          </div>

          <div>
            <FontAwesomeIcon icon={faLock} />
            <div>
              <h3>
                기본 공개 설정
                <FontAwesomeIcon
                  className={styles.caret_down}
                  icon={faCaretDown}
                />
                <FontAwesomeIcon
                  icon={faCircleQuestion}
                  style={{ marginLeft: '5px' }}
                />
              </h3>
            </div>
          </div>
          <div>
            <FontAwesomeIcon icon={faBell} />
            <div>
              <h4>알림 추가</h4>
            </div>
          </div>
        </div>
        <div className={styles.modal_line} />
        <div className={styles.modal_footer}>
          <button>옵션 더보기</button>
          <button>저장</button>
        </div>
      </div>
    </Modal>
  );
};

Index.propTypes = {
  hideModal: PropTypes.func,
  style: PropTypes.object,
};

export default Index;
