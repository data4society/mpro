import { BasePackage } from 'substance'

import SubConfigurator from '../common/SubConfigurator'

import FiltersPackage from '../filters/package'
import AcceptorFilterPackage from '../acceptor-filter/package'
import EntityFacetsPackage from '../entity-facets/package'
import FacetsPackage from '../facets/package'
import RubricsPackage from '../rubrics/package'
import HeaderPackage from '../header/package'
import FeedPackage from '../feed/package'
import SimplePagerPackage from '../simple-pager/package'
import PagerPackage from '../pager/package'
import InboxPackage from '../inbox/package'
import CollectionsPackage from '../collections/package'
import ConfiguratorPackage from '../configurator/package'
import LoaderPackage from '../loader/package'
import ViewerPackage from '../viewer/package'
import EditorPackage from '../editor/package'
import NotificationPackage from '../notification/package'
import CollaboratorsPackage from '../collaborators/package'
import ApiPackage from '../apis/package'
import ResourcesPackage from '../resources/package'
import UsersPackage from '../users/package'
import WelcomePackage from '../welcome/package'

// Article configurator
// Holds article schema
import Article from '../article/package'
let articleViewerConfigurator = new SubConfigurator().import(ViewerPackage)
articleViewerConfigurator.import(BasePackage)
articleViewerConfigurator.import(Article)

// Vk configurator
// Holds vkontakte posts schema
import Vk from '../vk/package'
let vkViewerConfigurator = new SubConfigurator().import(ViewerPackage)
vkViewerConfigurator.import(BasePackage)
vkViewerConfigurator.import(Vk)

// Tng configurator
// Holds training articles schema
import Tng from '../tng/package'
let tngEditorConfigurator = new SubConfigurator().import(EditorPackage)
tngEditorConfigurator.import(BasePackage)
tngEditorConfigurator.import(Tng)

// Entities configurator
// Holds entity container document schema
import Entities from '../entities/package'
let entitiesConfigurator = new SubConfigurator().import(Entities)
export default {
  name: 'mpro',
  configure: function(config) {
    config.import(BasePackage)
    config.import(InboxPackage)
    config.import(CollectionsPackage)
    config.import(ConfiguratorPackage)
    config.import(HeaderPackage)
    config.import(FeedPackage)
    config.import(PagerPackage)
    config.import(SimplePagerPackage)
    config.import(RubricsPackage)
    config.import(FiltersPackage)
    config.import(AcceptorFilterPackage)
    config.import(EntityFacetsPackage)
    config.import(FacetsPackage)
    config.import(LoaderPackage)
    config.import(NotificationPackage)
    config.import(CollaboratorsPackage)
    config.import(ApiPackage)
    config.import(ResourcesPackage)
    config.import(UsersPackage)
    config.import(WelcomePackage)
    
    // Default configuration for available modes
    config.addConfigurator('viewer-mpro-article', articleViewerConfigurator)
    config.addConfigurator('viewer-mpro-vk', vkViewerConfigurator)
    config.addConfigurator('editor-mpro-tng', tngEditorConfigurator)
    config.addConfigurator('mpro-entities', entitiesConfigurator)
  }
}
