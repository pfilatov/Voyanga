<script type="text/html" id="event-map">
    <div class="innerBlockMain">
        <div class="mapsBigAll"></div>
        <div class="toursBigAll" data-bind='with: currentEvent'>
            <div class="centerTours">
                <div class="close" onclick="closeEventsPhoto()"></div>
                <div class="IMGmain">
                    <img data-bind="highlightChange: image, previousImage: $parent.previousImage">
                </div>
                <a href="#" class="textTours">
                    <span class="txt" data-bind="text: preview()">Гран-при Италии, гонки F1 на самой быстрой трассе сезона</span><br>
					<span class="priceSelect">
						<span class="price" data-bind="text: minimalPrice()">15 250</span> <span class="rur">o</span>
					</span>
                </a>
            </div>
        </div>
    </div>
</script>