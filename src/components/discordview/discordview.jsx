import React from 'react';

import MessageBodyContainer from './messagebody';
import MessageTimestamp from 'components/common/timestamp';
import EmbedsContainer from './embeds';

const CozyMessageHeader = ({ compactMode, username }) => {
  if (compactMode) {
    return null;
  }

  return (
    <h2 style={{ lineHeight: '16px' }}>
      <span className="username-wrapper v-btm">
        <strong className="user-name">{username}</strong>
        <span className="bot-tag">BOT</span>
      </span>
      <span className="highlight-separator"> - </span>
      <MessageTimestamp compactMode={compactMode} />
    </h2>
  );
};

const Avatar = ({ compactMode, url }) => {
  if (compactMode) {
    return null;
  }

  return <div className="avatar-large animate" style={{ backgroundImage: `url('${url}')` }} />;
};

const ErrorHeader = ({ error }) => {
  if (!error) {
    return null;
  }

  return <header className="f6 bg-red br2 pa2 br--top w-100 code pre-wrap">{error}</header>;
};

const DiscordViewWrapper = ({ darkTheme, children }) => {
  // yikes
  // we could actually just flatten the styling out on the respective elements,
  // but copying directly from discord is a lot easier than that
  return (
    <div className="w-100 h-100 overflow-auto pa2 discord-view">
      <div className={`flex-vertical whitney ${darkTheme && 'theme-dark'}`}>
        <div className="chat flex-vertical flex-spacer">
          <div className="content flex-spacer flex-horizontal">
            <div className="flex-spacer flex-vertical messages-wrapper">
              <div className="scroller-wrap">
                <div className="scroller messages">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DiscordView = React.createClass({
  getDefaultProps() {
    return {
      username: 'Discord Bot',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
    };
  },

  render() {
    const {
      compactMode, darkTheme, webhookMode,
      username, avatar_url, error,
    } = this.props;

    const bgColor = darkTheme ? 'bg-discord-dark' : 'bg-discord-light';
    const cls = `w-100 h-100 br2 flex flex-column white overflow-hidden ${bgColor}`;

    return (
      <div className={cls}>
        <ErrorHeader error={error} />
        <DiscordViewWrapper darkTheme={true}>
          <div className={`message-group hide-overflow ${compactMode ? 'compact' : ''}`}>
            <Avatar url={avatar_url} compactMode={false} />
            <div className="comment">
              <div className="message first">
                <CozyMessageHeader username={username} compactMode={false} />
                <div className="message-text">
                  <MessageBodyContainer
                    username={username}
                    compactMode={false}
                    webhookMode={webhookMode}
                  />
                </div>
                <EmbedsContainer />
              </div>
            </div>
          </div>
        </DiscordViewWrapper>
      </div>
    );
  },
});


export default DiscordView;
