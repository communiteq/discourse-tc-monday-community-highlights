import Component from '@glimmer/component';
import { withPluginApi } from "discourse/lib/plugin-api"
import { tracked } from '@glimmer/tracking';
import { ajax } from "discourse/lib/ajax";
import { action } from '@ember/object'
import { bind } from "discourse-common/utils/decorators"

export default class CommunityHighlights extends Component {
    @tracked mustShow = false;
    @tracked highlight_topics = [];
    index = 0;

    constructor() {
        super(...arguments);
        withPluginApi("0.3.0", (api) => {
            api.onPageChange((url, title) => {
                if ((url == "/") || url.startsWith('/?')) {
                    this.mustShow = true;
                } else {
                    this.mustShow = false;
                }
                if (this.mustShow) {
                    this.highlight_topics = JSON.parse(settings.highlight_topics);
                }
            });
        });
    }

    get showComponent() {
        return this.mustShow;
    }

    get circleNos() {
        return new Array(this.highlight_topics.length).fill(null).map((_, index) => index);
    }

    updateSlides(index) {
        const slidesWrapper = document.querySelector('.community-highlights-topics-list');
        const slideWidth = slidesWrapper.offsetWidth;
        slidesWrapper.scrollLeft = index * (slideWidth + 20) * 0.85;
    }

    updateIndicators(index) {
        this.index = index;
        const indicators = document.querySelectorAll('.community-highlights .circle-indicators .circle');
        indicators.forEach((indicator, idx) => {
            if (idx === index) {
                indicator.style.backgroundColor = '#6161ff';
                indicator.style.borderColor = '#6161ff';
            } else {
                indicator.style.backgroundColor = 'transparent';
                indicator.style.borderColor = '#676879';
            }
        });
      }

    @action
    selectSlide(event) {
        const target = event.target;
        const index = parseInt(target.dataset.index, 10);
        this.updateSlides(index);
        this.updateIndicators(index);
    }

    @action
    onComponentMount() {
        const element = document.querySelector('.community-highlights-topics-list');
        element.addEventListener('scroll', (event) => {
          var idx = Math.max(Math.floor(event.target.scrollLeft / 250), 0);
          if (idx != this.index) {
              this.updateIndicators(idx);
          }
        });
    }
}
