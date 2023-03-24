import { GLOBAL_EVENT } from '@/event';
import { CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { ProLayoutProps } from '@ant-design/pro-components';
import { useModel, useNavigate } from '@umijs/max';
import type { MenuDataItem } from '@umijs/route-utils';
import { getMatchMenu, transformRoute } from '@umijs/route-utils';
import { Dropdown, Menu } from 'antd';
import cs from 'classnames';
import {
    ComponentProps,
    FC,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import './style.less';
const {
  DragDropContext,
  Draggable,
  Droppable,
} = require('react-beautiful-dnd')  ;
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

type List = MenuDataItem & {
  pathname: string;
};

export interface TableLayoutProps {
  props: ProLayoutProps;
}
const TabsLayout: FC<TableLayoutProps> = ({ props }) => {
  const { initialState } = useModel('@@initialState');
  const menuTreeMap = useRef<Record<string, any>>({});
  useEffect(() => {
    // menuTreeMap.current = treeToMap(
    //   JSON.parse(JSON.stringify(initialState?.initMenuData)),
    //   'path',
    // );
  }, [initialState]);
  let navigate = useNavigate();
  // 记录列表
  const [list, setList] = useState<List[]>([]);
  // 当前的key
  const [activeKey, setActiveKey] = useState<string>();
  const [show, setShow] = useState<boolean>(true);

  const currentPathConfig = useMemo(() => {
    const { menuData } = transformRoute(
      props?.route?.routes || [],
      undefined,
      undefined,
      true,
    );
    // 动态路由匹配
    return getMatchMenu(props.location?.pathname as string, menuData).pop();
  }, [props.location?.pathname, props?.route?.routes]);

  useEffect(() => {
    let pathname: string = props.location?.pathname || '';
    pathname =
      pathname.substring(pathname.length - 1) === '/'
        ? pathname
        : `${pathname}/`;

    if (!currentPathConfig) {
      return;
    }

    if (!currentPathConfig.name) {
      return;
    }

    setList((draft) => {
      if (
        !draft.some((v) => {
          return v.pathname === pathname || v.pathname === `${pathname}/`;
        })
      ) {
        return draft.concat({
          ...currentPathConfig,
          name:
            menuTreeMap.current?.[currentPathConfig.path || '']?.title || '',
          pathname,
        } as any);
      }

      return draft;
    });

    setActiveKey(pathname);
  }, [currentPathConfig, props.location?.pathname]);

  useEffect(() => {
    if (!list.length || !activeKey) {
      return;
    }

    const findIndex = list.findIndex((v) => v.pathname === activeKey);

    if (findIndex > -1) {
      document
        .querySelectorAll('.global-tabs-layout-item')
        [findIndex]?.scrollIntoView();
    }
  }, [list, activeKey]);

  const handleOnDragEnd: ComponentProps<typeof DragDropContext>['onDragEnd'] = (
    result: any,
  ) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newList = reorder(
      list,
      result.source.index,
      result.destination.index,
    );

    setList(newList);
  };

  // 水平滚动条监听滑动事件
  useEffect(() => {
    // 初始化菜单数据

    const $list = document.querySelector('.global-tabs-layout-list') as
      | HTMLDivElement
      | undefined;

    function scrollHorizontally(event: any) {
      const e = window.event || event;
      const delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
      if ($list) {
        $list.scrollLeft -= delta * 50;
      }
      e.preventDefault();
    }

    if ($list) {
      $list.addEventListener('mousewheel', scrollHorizontally, false);
      $list.addEventListener('DOMMouseScroll', scrollHorizontally, false);
    }

    return () => {
      $list?.addEventListener('mousewheel', scrollHorizontally, false);
      $list?.addEventListener('DOMMouseScroll', scrollHorizontally, false);
    };
  }, []);

  const closeSelf = (targetKey: string | undefined) => {
    setList((draft) => {
      const findIndex = draft.findIndex((v) => v.pathname === targetKey);

      if (findIndex <= -1) {
        return draft;
      }

      if (draft[findIndex].pathname === activeKey) {
        const offsetActiveKey =
          findIndex + 1 < draft.length
            ? draft[findIndex + 1].pathname
            : findIndex - 1 >= 0
            ? draft[findIndex - 1].pathname
            : draft[0].pathname;

        setActiveKey(offsetActiveKey);
        navigate(offsetActiveKey);
      }

      return draft.filter((_, i) => i !== findIndex);
    });
  };

  const getDropMenu = (targetKey: string | undefined) => {
    return (
      <Menu>
        {list.length > 1 && (
          <Menu.Item
            key="关闭"
            onClick={() => {
              closeSelf(targetKey);
            }}
            icon={<CloseOutlined />}
          >
            关闭
          </Menu.Item>
        )}

        <Menu.Item
          key="关闭其他"
          onClick={() => {
            setList((draft) => {
              const newList = draft.filter((v) => v.pathname === targetKey);

              setActiveKey(newList[0].pathname);
              navigate(newList[0].pathname);

              return newList;
            });
          }}
          icon={<CloseOutlined />}
        >
          关闭其他
        </Menu.Item>
        <Menu.Item
          key="关闭右侧"
          onClick={() => {
            setList((draft) => {
              const findIndex = draft.findIndex(
                (v) => v.pathname === targetKey,
              );

              if (findIndex <= -1) {
                return draft;
              }

              return draft.filter((_, i) => i <= findIndex);
            });
          }}
          icon={<RightOutlined />}
        >
          关闭右侧
        </Menu.Item>
        <Menu.Item
          key="关闭左侧"
          onClick={() => {
            setList((draft) => {
              const findIndex = draft.findIndex(
                (v) => v.pathname === targetKey,
              );

              if (findIndex <= -1) {
                return draft;
              }

              return draft.filter((_, i) => i >= findIndex);
            });
          }}
          icon={<LeftOutlined />}
        >
          关闭左侧
        </Menu.Item>
      </Menu>
    );
  };
  GLOBAL_EVENT.once('showGlobalTabBar', (data) => {
    setShow(data);
  });
  GLOBAL_EVENT.once('clearGlobalTabBarList', () => {
    setList([]);
  });
  return show ? (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="global-tabs-layout">
        <Droppable direction="horizontal" droppableId="droppable">
          {(wrapProvided: any, wrapSnapshot: any) => {
            return (
              <div
                className={cs('global-tabs-layout-list', {
                  'is-draging': wrapSnapshot.isUsingPlaceholder,
                })}
                {...wrapProvided.droppableProps}
                ref={wrapProvided.innerRef}
              >
                {list.map((item, index) => {
                  return (
                    <Draggable
                      key={item.pathname}
                      draggableId={item.pathname}
                      index={index}
                    >
                      {(provided: any) => (
                        <Dropdown
                          overlay={getDropMenu(item.pathname)}
                          trigger={['contextMenu']}
                        >
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cs('global-tabs-layout-item', {
                              active: item.pathname === activeKey,
                            })}
                            onClick={() => {
                              if (item.pathname === activeKey) {
                                return;
                              }

                              setActiveKey(item.pathname);
                              navigate(item.pathname);
                            }}
                          >
                            <div className="global-tabs-layout-item-label">
                              {item.name}
                            </div>

                            {list.length > 1 && (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();

                                  closeSelf(item.pathname);
                                }}
                                className="global-tabs-layout-item-close"
                              >
                                <CloseOutlined />
                              </div>
                            )}
                          </div>
                        </Dropdown>
                      )}
                    </Draggable>
                  );
                })}
                {wrapProvided.placeholder}
              </div>
            );
          }}
        </Droppable>

        {/* <div className="global-tabs-layout-extra">
          <Dropdown overlay={getDropMenu(activeKey)} trigger={['hover']}>
            <AppstoreOutlined />
          </Dropdown>
        </div> */}
      </div>
    </DragDropContext>
  ) : (
    <></>
  );
};

export default TabsLayout;
